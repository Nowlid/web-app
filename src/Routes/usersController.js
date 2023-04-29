import { hash, compare } from 'bcrypt';
import Database from 'better-sqlite3';
import jwtUtils, * as jwt from '../Utils/jwt.utils.js';
import * as emailUtils from '../Utils/email.utils.js';

const USERNAME_REGEX = /^[A-Za-z0-9--_]/;
const EMAIL_REGEX = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-zA-Z])(?=).{8,1048}/;

export default {
    register: (req, res) => {
        res.render('pages/register', {register: false, users: undefined})
    },

    login: (req, res) => {
        res.render('pages/login', {register: true, users: undefined})
    },

    user: (req, res) => {
        const { cookies } = req
        let user;
        if(cookies["__SESSION_TOKEN"]) {
            const token = jwtUtils.validateToken(cookies["__SESSION_TOKEN"])
            if(token.exp > Math.floor(Date.now() / 1000)) user = new Database('src/Database/users.db').prepare(`SELECT id, username, email, dateCreated, avatar FROM Users WHERE id = ?`).get(token.userId)
        }

        if(!user) return res.render('pages/register', {register: false, users: undefined})
        res.render('pages/user', {users: user})
    },

    delete: (req, res) => {
        res.render('pages/delete', {succes: undefined, users: undefined})
    },

    deleteConfirm: async (req, res) => {
        const {token} = req.params;
        const checkToken = jwtUtils.validateToken(token);

        if(!checkToken) return res.status(404).json({'Error': 'Validate URL not found'});
        if(checkToken.exp < Math.floor(Date.now() / 1000)) return res.status(400).json({'Error': 'Validate URL expired'});
        
        const db = new Database('src/Database/users.db')
        const user = db.prepare(`SELECT username FROM Users WHERE id = ?`).get(checkToken.userId);

        if(!user) return res.status(404).json({'Error': 'User not found'});

        switch(checkToken.type) {
            case "delete":
                db.prepare('DELETE FROM Users WHERE username = ?').run(user.username);
            return res.status(200).clearCookie('__SESSION_TOKEN').redirect('/');
        };
    },

    validate: async (req, res) => {
        const { email, password, methode } = req.body;

        if(!email || !password) return res.status(400).json({'Error': 'Missing parameters'});

        const user = new Database('src/Database/users.db').prepare(`SELECT username, id, email, password FROM Users WHERE email = ?`).get(email);

        if(!user) return res.status(404).json({'Error': 'User not found'});

        compare(password, user.password, (err, resBcrypt) => {
            if(!resBcrypt) res.status(403).json({ 'Error': 'Invalid Password'});
            else {
                switch(methode) {
                    case 'delete':
                        emailUtils.default.sendMail(
                            {
                                email: user.email, 
                                subject: "Nowlid - Confirm account deletion", 
                                textPart: "Nowlid - Confirm account deletion",
                                htmlPart: `
                                <center>
                                    <a href="http://localhost/users/delete/${jwtUtils.generateValidateToken(user, "delete")}" target="_blank"">Confirm account deletion</a>
                                </center>
                                `
                            })
                        .then(() => {
                            return res.status(200).render('pages/delete', {succes: true, data: undefined});
                        }).catch(() => {
                            return res.status(200).render('pages/delete', {succes: false, data: undefined});
                        });
                    break;
                }
            }
        });
    },

    createAccount: (req, res) => {
        const { email, username, password } = req.body;

        if(!username || username.length <= 2 || username.length >= 28) return res.status(400).json({'Error': 'Wrong username/password (must be length 2 - 28)'});
        if(!USERNAME_REGEX.test(username.trim())) return res.status(400).json({'Error': 'Wrong username (any special caracter)'});
        if(!PASSWORD_REGEX.test(password)) return res.status(400).json({'Error': 'Wrong password'});
        if(!EMAIL_REGEX.test(email)) return res.status(400).json({'Error': 'Wrong email'});

        const db = new Database('src/Database/users.db');
        if(db.prepare('SELECT 1 FROM Users WHERE email = ? LIMIT 1').pluck().get(email) || db.prepare('SELECT 1 FROM Users WHERE username = ? LIMIT 1').pluck().get(username.trim())) return res.status(409).json({'Error': 'User already exist'});
   
        hash(password, 5, (err, bcryptedPassword) => {
            db.prepare('INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?)').run(null, email, username.trim(), bcryptedPassword, "null", Date.now());
            return res.status(201).redirect('/');
        });
    },

    connectAccount: (req, res) => {
        const { email, password } = req.body;

        if(!email || !password) return res.status(400).json({'Error': 'Missing parameters'});

        let user =  new Database('src/Database/users.db').prepare(`SELECT id, password FROM Users WHERE email = ?`).get(email)
        if(!user) return res.status(404).json({'Error': 'User not found'});

        compare(password, user.password, (err, resBcrypt) => {

            if(!resBcrypt) return res.status(403).json({ 'Error': 'Invalid Password' });

            const token = jwt.default.generateTokenUser(user);
            res.cookie('__SESSION_TOKEN', token, { secure: true, httpOnly: false, sameSite: "lax", maxAge: 10 * 60 * 1000});

            return res.status(201).redirect('/');
        });
    },

    logoutAccount: (req, res) => {
        res.status(200).clearCookie('__SESSION_TOKEN').redirect('/');
    },
};