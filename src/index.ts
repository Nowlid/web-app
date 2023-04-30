import express from 'express';
import cookieParser from 'cookie-parser';
import pkg from 'body-parser';
const { urlencoded, json } = pkg;
import Database from 'better-sqlite3';
import { userRoute } from './routers.ts';
import jwtUtils from './Utils/jwt.utils.ts';

new Database('Database/users.db').prepare(`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, username TEXT, password TEXT, avatar TEXT, dateCreated TEXT)`).run();
const app = express();

app.listen(80, () => {
    console.log('- Serveur in listen !');
});

app.use(urlencoded({extended: true}));
app.use(json());
app.use(express.static('./public'));
app.use(cookieParser()); 

app.set('views', './views/');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const { cookies }: {cookies: {[key: string]: string}} = req
    let user;
    if(cookies["__SESSION_TOKEN"]) {
        const token = jwtUtils.validateToken(cookies["__SESSION_TOKEN"])
        if(token && token.exp) {
            if(token.exp > Math.floor(Date.now() / 1000)) user = new Database('Database/users.db').prepare(`SELECT id, username, email, dateCreated, avatar FROM Users WHERE id = ?`).get(token.userId)
        }
    }
    res.render('pages/home', {users: user})
});

app.use('/users', userRoute);