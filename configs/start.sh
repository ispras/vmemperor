#!/bin/sh
cd app
nohup python3.7 vmemperor.py &
cd frontend
npm run start
