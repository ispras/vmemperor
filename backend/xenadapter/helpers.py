import logging


def use_logger(method):
    '''
    Replaces a plain "XenAdapter" module name in log file with this class' repr for this method
    :param method:
    :return:
    '''
    def decorator(self, *args, **kwargs):
        oldFormatter = self.xen.fileHandler.formatter
        self.xen.fileHandler.setFormatter(
            logging.Formatter(
                f"%(levelname)-10s [%(asctime)s] {repr(self)}: {self.uuid}: %(message)s")
        )
        ret = method(self, *args, **kwargs)
        self.xen.fileHandler.setFormatter(oldFormatter)
        return ret

    return decorator