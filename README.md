# Groupomania

7th project of openclassroom web dev course

## DATABASE

1. Connect to the mySQL server of your choice
2. Create a new schema (for example : groupomania)
3. Create a .env file in the root folder with the username and the password which you use to connect to your database, then modify the name of the database by the name of the schema that you have previously created.

## SERVER

1. Full list of required .env file properties
- PORT=(server port)
- CLIENT_PORT
- DB_HOST
- DB_USER
- DB_PASS
- DB=(DB name)
- DB_DIALECT
- TKEY=(token key)
- URL_SERVER
- URL_CLIENT
2. npm install in the server folder.
3. Comment the desired section in app.js file for dev(see db.init.js for basic settings and testing only!).
3. Type npm start from the server folder in the terminal to start the server.

## CLIENT

1. npm install in the client folder.
2. Create a .env.local file in the client root folder and type
- REACT_APP_BASE_URL=(server port).
3. Type npm start from the client folder in the terminal to start the react App.