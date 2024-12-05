# SoCalSocial
CSE 110 group 0 project (SoCalSocial)

For running the code

`cd frontend/`

`npm install`

`npm start`

Then open another terminal

`cd backend/`

`pip install -r requirements.txt`

`fastapi dev ./src/app.py`

We recommend using a virtual environment to run the backend.

If you encounter bugs like "Cannot find module 'some_module_name' or its corresponding type declarations."
First `npm install some_module_name`
If still don't work
`rm -rf node_modules package-lock.json`
`npm install`
Then restart the vscode

If you still encounter the issue 
try `npm install --save-dev @types/some_module_name`

## Demo Video
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/m3Xlao0JmpI/0.jpg)](https://www.youtube.com/watch?v=m3Xlao0JmpI)
