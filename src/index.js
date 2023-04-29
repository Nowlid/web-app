import express from 'express';
import cookieParser from 'cookie-parser';
import pkg from 'body-parser';
const { urlencoded, json } = pkg;
import Database from 'better-sqlite3';
import { userRoute } from './routers.js';
import jwtUtils from './Utils/jwt.utils.js';
import { RecaptchaV3 } from 'express-recaptcha';
const Recaptcha = new RecaptchaV3('6Lc75awlAAAAAIxzboLUQkfenExdcIFexUFUxz27', '6Lc75awlAAAAAJyMw5-GaypwR5g6_U5j4RDk6Mtx', { callback: 'cb' });

new Database('src/Database/users.db').prepare(`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, username TEXT, password TEXT, avatar TEXT, dateCreated TEXT)`).run();

const app = express();

app.listen(80, () => {
    console.log('- Serveur in listen !');
});

app.use(urlencoded({extended: true}));
app.use(json());
app.use(express.static('./src/Public'));
app.use(cookieParser()); 

app.set('views', './src/Views/');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const { cookies } = req
    let user;
    if(cookies["__SESSION_TOKEN"]) {
        const token = jwtUtils.validateToken(cookies["__SESSION_TOKEN"])
        if(token.exp > Math.floor(Date.now() / 1000)) user = new Database('src/Database/users.db').prepare(`SELECT id, username, email, dateCreated, avatar FROM Users WHERE id = ?`).get(token.userId)
    }
    res.render('pages/home', {users: user})
})

// app.post('/', Recaptcha.middleware.verify, function (req, res) {
//     console.log('123')
//     if (!req.recaptcha.error) {
//         res.redirect('/')
//     } else {
//         console.log('test2')
//         res.redirect('/')
//     }
// })

app.use('/users', userRoute);