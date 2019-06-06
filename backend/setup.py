#!/usr/bin/env python3
from distutils.core import setup
setup(name='vmemperor',
      version='0.0.1',
      description='XenServer automation tools',
      py_modules=['xenadapter', 'vmemperor', 'XenAPI', 'provision', 'hooks', 'config_parser'],
      requires=['tornado', 'six'])
