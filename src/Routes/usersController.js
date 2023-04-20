import { hash, compare } from 'bcrypt';
import Database from 'better-sqlite3';
import * as jwt from '../Utils/jwt.utils.js'

const USERNAME_REGEX = /[^A-Za-z0-9--_]/;
const EMAIL_REGEX = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

export default {
    register: (req, res) => {
        res.render('pages/connection', {register: false})
    },

    login: (req, res) => {
        res.render('pages/connection', {register: true})
    },

    createAccount: (req, res) => {
        const { email, username, password } = req.body;

        if(username.length <= 2 || username.length >= 28) return res.status(400).json({'Error': 'Wrong username/password (must be length 2 - 28)'});
        if(USERNAME_REGEX.test(username.trim())) return res.status(400).json({'Error': 'Wrong username (any special caracter)'});
        if(!PASSWORD_REGEX.test(password)) return res.status(400).json({'Error': 'Wrong password'});
        if(!EMAIL_REGEX.test(email)) return res.status(400).json({'Error': 'Wrong email'});

        const db = new Database('src/Database/users.db');
        if(db.prepare('SELECT 1 FROM Users WHERE email = ? LIMIT 1').pluck().get(email) || db.prepare('SELECT 1 FROM Users WHERE username = ? LIMIT 1').pluck().get(username.trim())) return res.status(409).json({'Error': 'User already exist'});
   
        hash(password, 5, (err, bcryptedPassword) => {
            return res.status(201).json({
                'userId': db.prepare('INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?)').run(null, email, username.trim(), bcryptedPassword, "null", Date.now()).lastInsertRowid
            });
        });
    },

    connectAccount: (req, res) => {
        const { identify, password } = req.body;

        if(!identify || !password) return res.status(400).json({'Error': 'Missing parameters'});

        let user =  new Database('src/Database/users.db').prepare(`SELECT id, password FROM Users WHERE email = ?`).get(identify)
        if(!user) return res.status(404).json({'Error': 'User not found'});

        compare(password, user.password, (err, resBcrypt) => {
            if(!resBcrypt) return res.status(403).json({ 'Error': 'Invalid Password' });
            return res.status(200).json({
                'userId': user.id,
                'token': jwt.default.generateTokenUser(user)
            });
        });
    }
};