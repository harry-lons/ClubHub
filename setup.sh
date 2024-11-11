#!/bin/bash
echo "SETTING UP BACKEND"
pip install -r backend/requirements.txt
echo "INSTALLING Postgres"
sudo apt update
sudo apt -y install postgresql
echo "SETTING UP FRONTEND"
cd frontend
npm i