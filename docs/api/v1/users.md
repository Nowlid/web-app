# Users Routes

## GET /register

This route returns the register page of the website.

### Response
return connection.ejs (register: false) to register.html

## GET /login

This route returns the login page of the website.

### Response
return connection.ejs (register: true) to login.html

## POST /register

This route allows users to create a new account.

The request body should contain a JSON object with the following properties:

- `username`:  the user's name (string ex: Hecone324)
- `email`: the user's email adress (string ex: example@example.com)
- `password`: the user's password (string ex: Ade&32DgB&)

### Response
- `userId`: a userId
- `token`: a JSON Web Token (JWT) that can be used to authenticate subsequent requests

## POST /login

This route allows users to login to their account.

The request body should contain a JSON object with the following properties:

- `email`: the user's email adress
- `password`: the user's password

### Response
- `userId`: a userId
- `token`: a JSON Web Token (JWT) that can be used to authenticate subsequent requests

## POST /validate

This route send a mail confirmation

The request body should contain a JSON object with the following properties:

- `email`: the user's email adress
- `password`: the user's password
- `methode`: delete/...

### Response
- Email Send || Email not Send


## GET /delete/:token

This route delete the account

### Response
- Account Delete || Users not found || URL/Token Error