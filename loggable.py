import logging
import sys
from tornado.options import options as opts
import os

class Loggable:
    '''
    TODO: Rewrite using http://code.activestate.com/recipes/474089-extending-the-logging-module/
    TODO https://docs.python.org/3/library/logging.html#logging.setLogRecordFactory
    '''

    def init_log(self):
        self.log = logging.getLogger(self.__class__.__name__)
        self.log.propagate = False
        self.log.setLevel(logging.DEBUG)
        if self.log.hasHandlers():
            for handler in self.log.handlers:
                if type(handler) in (logging.FileHandler, logging.StreamHandler) and not hasattr(self, 'fileHandler'):
                    self.fileHandler = handler
            return

        if os.environ.get('DOCKER', False):
            self.fileHandler = logging.StreamHandler(stream=sys.stderr)
        else:
            self.fileHandler = logging.FileHandler(opts.log_file_name)

        if not hasattr(self, 'log_format'):
            self.log_format = "%(levelname)-10s [%(asctime)s] {0}: %(message)s".format(repr(self))
        self.formatter = logging.Formatter(self.log_format)
        self.fileHandler.setLevel(logging.DEBUG)
        self.fileHandler.setFormatter(self.formatter)
        self.log.addHandler(self.fileHandler)
        if hasattr(self, 'debug') and self.debug:
            if not hasattr(self, 'debugHandler'):
                self.debugHandler = logging.StreamHandler(sys.stderr)
            self.debugHandler.setLevel(logging.ERROR)
            if not hasattr(self, 'debug_log_format'):
                debug_log_format = "%(filename)s:%(lineno)d: %(message)s"
            else:
                debug_log_format = self.debug_log_format

            debugFormatter = logging.Formatter(debug_log_format)
            self.debugHandler.setFormatter(debugFormatter)
            self.log.addHandler(self.debugHandler)
            # self.log.error("Running in debug mode: all errors are in stderr, for further info check log file")

    def create_additional_log(self, name):
        log = logging.getLogger(name + self.__class__.__name__)
        log.propagate = False
        log.setLevel(logging.DEBUG)
        fileHandler = logging.FileHandler(f"{name}.log")
        log_format = f"%(levelname)-10s [%(asctime)s] {self.__class__.__name__}: %(message)s"
        formatter = logging.Formatter(log_format)
        fileHandler.setLevel(logging.DEBUG)
        fileHandler.setFormatter(formatter)
        log.addHandler(fileHandler)
        if hasattr(self, 'debug') and self.debug:
            debugHandler = logging.StreamHandler(sys.stderr)
            debugHandler.setLevel(logging.ERROR)
            if not hasattr(self, 'debug_log_format'):
                debug_log_format = "%(filename)s:%(lineno)d: %(message)s"
            debugFormatter = logging.Formatter(debug_log_format)
            debugHandler.setFormatter(debugFormatter)
            log.addHandler(debugHandler)

        return log