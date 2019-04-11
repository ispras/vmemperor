import pathlib
from urllib.parse import urlparse, parse_qs
import tailer
from tornado import ioloop

from tornado.options import options
from handlers.base import BaseWSHandler


class PlaybookLogHandler(BaseWSHandler):
    def check_origin(self, origin):
        return True

    def read_file(self, file : pathlib.Path):
        with open(file.resolve(), 'r') as file_handle:
            for line in tailer.follow(file_handle):
                if line:
                    self.write_message(line)



    async def open(self):
        url_parsed = urlparse(self.request.uri)
        try:
            id = parse_qs(url_parsed.query)['id'][0]
        except KeyError:
            await self.write_message("No argument id")
            self.close()
            return

        log_dir = pathlib.Path(options.ansible_logs).joinpath(id)
        if not log_dir.is_dir():
            await self.write_message(f"{log_dir} is not a directory")
            self.close()
            return
        stdout = pathlib.Path(log_dir / 'stdout')
        if not stdout.is_file():
            await self.write_message(f"{stdout} is not a file")
        stderr = pathlib.Path(log_dir / 'stderr')
        if not stderr.is_file():
            await self.write_message(f"{stdout} is not a file")

        ioloop.IOLoop.current().run_in_executor(self.executor, self.read_file, stdout)
        ioloop.IOLoop.current().run_in_executor(self.executor, self.read_file, stderr)




