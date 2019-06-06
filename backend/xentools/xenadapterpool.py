import asyncio
import queue

from tornado.options import options as opts

from xentools.xenadapter import XenAdapter
from singleton import Singleton

class XenAdapterPool(metaclass=Singleton):
    def __init__(self):
        self._xens = queue.Queue()
        self._asyncio_xens = asyncio.Queue()

    def get(self):
        if not self._xens.empty():
           return self._xens.get()
        else:
            xen = XenAdapter({**opts.group_dict('xenadapter'), **opts.group_dict('rethinkdb')}, nosingleton=True)
            xen.log.debug("Getting new XenAdapter from XenAdapterPool: Empty queue!")
            return xen

    def unget(self, xen):
        xen.log.debug("Pushing back into XenPool")
        self._xens.put_nowait(xen)

    async def get_asyncio(self):
        if not self._asyncio_xens.empty():
            return await self._asyncio_xens.get()
        else:
            xen = XenAdapter({**opts.group_dict('xenadapter'), **opts.group_dict('rethinkdb')}, nosingleton=True)
            xen.log.debug("Getting new XenAdapter from XenAdapterPool (for AsyncIO): Empty queue!")
            return xen

    async def unget_asyncio(self, xen):
        xen.log.debug("Pushing back into XenPool (for AsyncIO)")
        await self._asyncio_xens.put(xen)