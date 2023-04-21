import express from 'express';
import cookieParser from 'cookie-parser';
import pkg from 'body-parser';
const { urlencoded, json } = pkg;
import Database from 'better-sqlite3';
import { route } from './routers.js';
import emailUtils from './Utils/email.utils.js';

new Database('src/Database/users.db').prepare(`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, username TEXT, password TEXT, avatar TEXT, dateCreated TEXT)`).run();

const app = express();

app.listen(8080, () => {
    console.log('- Serveur in listen !');
});

app.use(urlencoded({extended: true}));
app.use(json());
app.use(express.static('./src/Public'));
app.use(cookieParser()); 

app.set('views', './src/Views/');
app.set('view engine', 'ejs');

app.use('/', route);