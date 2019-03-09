import asyncio
import base64
import json
import socket
import traceback
from urllib.parse import urlparse, parse_qs, urlsplit

import tornado.ioloop
import tornado.iostream
import tornado.web
from sentry_sdk import capture_exception
from tornado.options import options as opts
from tornado.iostream import StreamClosedError
from tornado.websocket import WebSocketClosedError

from connman import ReDBConnection
from consolelist import ConsoleList
from handlers.base import BaseWSHandler
from xenadapter.vm import VM


class ConsoleHandler(BaseWSHandler):
    def check_origin(self, origin):
        return True

    def initialize(self, pool_executor):
        super().initialize(pool_executor=pool_executor)

        username = opts.username
        password = opts.password
        self.auth_token = base64.encodebytes('{0}:{1}'.format
                                             (username,
                                              password).encode())
        self.reader, self.writer = None, None


    async def open(self):
        '''
        This method proxies WebSocket calls to XenServer
        '''


        # Get VM vnc url
        url_parsed = urlparse(self.request.uri)
        try:
            secret = parse_qs(url_parsed.query)['secret'][0]
        except KeyError:
            await self.write_message("No argument secret")
            self.close()
            return


        async with ReDBConnection().get_async_connection() as conn:
            url = await ConsoleList.get_url_by_secret(conn, secret)
        if url is None:
            self.close()
            return
        vnc_url_parsed = urlsplit(url)
        port = vnc_url_parsed.port

        if port is None:
            port = 80 # TODO: If scheme is HTTPS, use 443
        self.log.debug(f"Opening connection to {vnc_url_parsed.hostname}:{port}")
        self.reader, self.writer =  await asyncio.open_connection(vnc_url_parsed.hostname, port)
        self.halt = False
        self.translate = False
        self.key = None

        uri = f'{vnc_url_parsed.path}?{vnc_url_parsed.query}'
        lines = [
            'CONNECT {0} HTTP/1.1'.format(uri),  # HTTP 1.1 creates Keep-alive connection
            'Host: {0}'.format(opts.vmemperor_host),
            #   'Authorization: Basic {0}'.format(self.auth_token),
        ]
        self.writer.write('\r\n'.join(lines).encode())
        self.writer.write(b'\r\nAuthorization: Basic ' + self.auth_token)
        self.writer.write(b'\r\n\r\n')
        tornado.ioloop.IOLoop.current().spawn_callback(self.server_reading)

    async def on_message(self, message):
        assert (isinstance(message, bytes))
        self.writer.write(message)
        try:
            await self.writer.drain()
        except (ConnectionResetError, BrokenPipeError):
            self.halt = True
            return

    def select_subprotocol(self, subprotocols):
        if 'binary' in subprotocols:
            proto = 'binary'
        else:
            proto = subprotocols[0] if len(subprotocols) else ""


        return proto

    async def server_reading(self):
        try:
            data_sent = False
            http_header_read = False
            while self.halt is False:
                if not data_sent:
                    data = await self.reader.read(100)
                    if not http_header_read:
                        notok = b'200 OK' not in data
                        if notok:
                            self.log.error(f"Unable to open VNC Console {self.request.uri}: Error: {data}")
                            self.close()
                            return
                        else:
                            http_header_read = True

                    try:
                        index = data.index(b'RFB')
                    except ValueError:
                        self.log.warning("server_reading: 200 OK returned, but no RFB in first data message. Continuing")
                        continue

                    data = data[index:]
                    data_sent = True
                else:
                    data = await self.reader.read(1024)
                try:
                    self.write_message(data, binary=True)
                except WebSocketClosedError as e:
                    return
                if self.reader.at_eof():
                    return

        except Exception as e:
            self.log.error(f"Exception: {e}")
            capture_exception(e)

    def on_close(self):
        self.halt = True
        if self.writer:
            self.writer.close()

