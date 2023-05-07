"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAccount = exports.connectAccount = exports.createAccount = exports.validate = exports.deleteConfirm = exports.delete_ = exports.user = exports.login = exports.register = void 0;
const bcrypt_1 = require("bcrypt");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const email_utils_1 = require("../Utils/email.utils");
const jwt_utils_1 = require("../Utils/jwt.utils");
const USERNAME_REGEX = /^[A-Za-z0-9--_]/;
const EMAIL_REGEX = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-zA-Z])(?=).{8,1048}/;
function register(_req, res) {
    res.render('pages/register', { register: false, user: undefined });
}
exports.register = register;
function login(_req, res) {
    res.render('pages/login', { register: true, user: undefined });
}
exports.login = login;
function user(req, res) {
    const { cookies } = req;
    let userDb;
    if (cookies['__SESSION_TOKEN']) {
        const token = (0, jwt_utils_1.validateToken)(cookies['__SESSION_TOKEN']);
        if (token?.exp && token.exp > Math.floor(Date.now() / 1000)) {
            userDb = new better_sqlite3_1.default('Database/users.db')
                .prepare(`SELECT id, username, email, dateCreated, avatar FROM Users WHERE id = ?`)
                .get(token['userId']);
        }
    }
    if (!user)
        return res.render('pages/register', { register: false, user: undefined });
    res.render('pages/user', { user: userDb });
}
exports.user = user;
function delete_(_req, res) {
    res.render('pages/delete', { succes: undefined, user: undefined });
}
exports.delete_ = delete_;
function deleteConfirm(req, res) {
    const { token } = req.params;
    if (!token)
        return res.status(404).json({ Error: 'Missing token' });
    const checkToken = (0, jwt_utils_1.validateToken)(token);
    if (!checkToken?.exp)
        return res.status(404).json({ Error: 'Validate URL not found' });
    if (checkToken.exp < Math.floor(Date.now() / 1000))
        return res.status(400).json({ Error: 'Validate URL expired' });
    const db = new better_sqlite3_1.default('Database/users.db');
    const user = db.prepare(`SELECT username FROM Users WHERE id = ?`).get(checkToken['userId']);
    if (!user)
        return res.status(404).json({ Error: 'User not found' });
    switch (checkToken['type']) {
        case 'delete':
            db.prepare('DELETE FROM Users WHERE username = ?').run(user.username);
            return res.status(200).clearCookie('__SESSION_TOKEN').redirect('/');
    }
}
exports.deleteConfirm = deleteConfirm;
function validate(req, res) {
    const { email, methode, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ Error: 'Missing parameters' });
    const user = new better_sqlite3_1.default('Database/users.db')
        .prepare(`SELECT username, id, email, password FROM Users WHERE email = ?`)
        .get(email);
    if (!user)
        return res.status(404).json({ Error: 'User not found' });
    (0, bcrypt_1.compare)(password, user.password, (_err, resBcrypt) => {
        if (!resBcrypt)
            res.status(403).json({ Error: 'Invalid Password' });
        else {
            switch (methode) {
                case 'delete':
                    (0, email_utils_1.sendMail)({
                        email: user.email,
                        htmlPart: `
            <center>
                <a href="http://localhost/users/delete/${(0, jwt_utils_1.generateValidateToken)(user, 'delete')}" target="_blank"">Confirm account deletion</a>
            </center>
            `,
                        subject: 'Nowlid - Confirm account deletion',
                        textPart: 'Nowlid - Confirm account deletion'
                    })
                        .then(() => {
                        return res.status(200).render('pages/delete', { data: undefined, succes: true });
                    })
                        .catch(() => {
                        return res.status(200).render('pages/delete', { data: undefined, succes: true });
                    });
                    break;
            }
        }
    });
}
exports.validate = validate;
function createAccount(req, res) {
    const { email, password, username } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ Error: 'Missing parameter' });
    if (username.length <= 2 || username.length >= 28)
        return res.status(400).json({ Error: 'Wrong username/password (must be length 2 - 28)' });
    if (!USERNAME_REGEX.test(username.trim()))
        return res.status(400).json({ Error: 'Wrong username (any special caracter)' });
    if (!PASSWORD_REGEX.test(password))
        return res.status(400).json({ Error: 'Wrong password' });
    if (!EMAIL_REGEX.test(email))
        return res.status(400).json({ Error: 'Wrong email' });
    const db = new better_sqlite3_1.default('Database/users.db');
    if (db.prepare('SELECT 1 FROM Users WHERE email = ? LIMIT 1').pluck().get(email) ||
        db.prepare('SELECT 1 FROM Users WHERE username = ? LIMIT 1').pluck().get(username.trim()))
        return res.status(409).json({ Error: 'User already exist' });
    (0, bcrypt_1.hash)(password, 5, (_err, bcryptedPassword) => {
        db.prepare('INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?)').run(null, email, username.trim(), bcryptedPassword, 'null', Date.now());
        return res.status(201).redirect('/');
    });
}
exports.createAccount = createAccount;
function connectAccount(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ Error: 'Missing parameters' });
    const user = new better_sqlite3_1.default('Database/users.db')
        .prepare(`SELECT id, password FROM Users WHERE email = ?`)
        .get(email);
    if (!user)
        return res.status(404).json({ Error: 'User not found' });
    (0, bcrypt_1.compare)(password, user.password, (_err, resBcrypt) => {
        if (!resBcrypt)
            return res.status(403).json({ Error: 'Invalid Password' });
        const token = (0, jwt_utils_1.generateTokenUser)(user);
        res.cookie('__SESSION_TOKEN', token, { httpOnly: false, maxAge: 10 * 60 * 1000, sameSite: 'lax', secure: true });
        res.status(201).redirect('/');
    });
}
exports.connectAccount = connectAccount;
function logoutAccount(_req, res) {
    res.status(200).clearCookie('__SESSION_TOKEN').redirect('/');
}
exports.logoutAccount = logoutAccount;
//# sourceMappingURL=usersController.js.map