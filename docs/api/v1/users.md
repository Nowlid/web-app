# Users Routes

## GET /

This route returns the user page if users exist else return register page of the website.

### Response
return user.ejs else get /register (users: user)

## GET /register

This route returns the register page of the website.

### Response
return connection.ejs (register: false, users: undefined) to register

## GET /login

This route returns the login page of the website.

### Response
return connection.ejs (register: true, users: undefined) to login

## GET /logout

This route logout of account and return home

### Response
return clear cookies and return home

## GET /delete

This route returns the delete page of the website.

### Response
return delete (succes: undefined/false/true)

## GET /delete/:token

This route delete the account

### Response
- Account Delete || Users not found || URL/Token Error

## POST /register

This route allows users to create a new account.

The request body should contain a JSON object with the following properties:

- `username`:  the user's name (string ex: Hecone324)
- `email`: the user's email adress (string ex: example@example.com)
- `password`: the user's password (string ex: Ade2Dgnnb)

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
