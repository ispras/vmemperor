#!/bin/sh
cd backend
nohup python3.7 vmemperor.py &
cd ..
cd frontend
npm run start
