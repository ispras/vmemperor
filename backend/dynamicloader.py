from pathlib import Path
import os
import sys
import importlib
from itertools import chain
import inspect


class DynamicLoader:
    def __init__(self, path):
        '''

        :param path: directory or .py file to load classes from
        '''
        if isinstance(path, Path):
            self.path = path
        elif isinstance(path, str):
            self.path = Path(path)
        else:
            raise TypeError(path)

        if str(self.path).endswith('.py'):
            self.modulename = self.path.stem
            self.path = self.path.parent


    def load_class(self, module=None, class_name=None, class_base=None):
        '''
        Load a class from a module
        :param module: module name (a file name without .py located in path). If None, search everywhere
        :param class_name: class name (str), if None, search by class_base. Only usable with specified 'module'
        :param class_base: base class (type) for a class
        :return: list of found classes
        '''
        if not module:
            if hasattr(self, 'modulename'):
                module = self.modulename



        cwd  = os.getcwd()
        if self.path.is_absolute:
            os.chdir(str(self.path))
        else:
            os.chdir(cwd + "/" + str(self.path))


        sys.path.append(os.getcwd())

        def get_class(module_name):
            mod = importlib.import_module(module_name)
            if class_name:
                if hasattr(mod, class_name):
                    return [getattr(mod, class_name)]
                else:
                    return None
            else:

                classes = (getattr(mod, attribute) for attribute in dir(mod))
                classes = (cl for cl in classes if inspect.isclass(cl) and  cl.__module__ == module_name)

                if class_base:
                    return [cl for cl in classes if class_base in cl.__bases__]
                else:
                    return list(classes)

        if not module:
            cur_path = Path('.')
            ret = list(chain(*[get_class(file.stem) for file in cur_path.glob('*.py')]))
        else:
            ret =  get_class(module)

        os.chdir(cwd)

        return ret















