'''
To add your class to event_dispatcher, subclass XenObject and specify EVENT_CLASSES list. The rest is done by XenObjectMeta
'''
from typing import Type
from collections.abc import Collection

import logging

EVENT_DISPATCHER = {}
'''
Key: XenAPI Event class: e.g. 'vdi'
Value: XenObject classes: e.g. [VDI, ISO] (see xenadapter/vdi.py on these particular classes)
'''

def add_to_event_dispatcher(cl: Type):

    def add(event_class):
        logging.debug(f"Event-dispatching {event_class} to {cl}")
        if event_class not in EVENT_DISPATCHER:
            EVENT_DISPATCHER[event_class] = []
        EVENT_DISPATCHER[event_class].append(cl)

    if hasattr(cl, 'EVENT_CLASSES'):

        if isinstance(cl.EVENT_CLASSES, str):
            add(cl.EVENT_CLASSES)
        elif isinstance(cl.EVENT_CLASSES, Collection):
            for event_class in cl.EVENT_CLASSES:
                add(event_class)
        else:
            return



