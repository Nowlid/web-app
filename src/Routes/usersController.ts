import { compare, hash } from 'bcrypt';
import Database from 'better-sqlite3';
import type { Request, Response } from 'express';

import { sendMail } from '../Utils/email.utils';
import { generateTokenUser, generateValidateToken, validateToken } from '../Utils/jwt.utils';

const USERNAME_REGEX = /^[A-Za-z0-9--_]/;
const EMAIL_REGEX = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-zA-Z])(?=).{8,1048}/;

interface User {
  avatar: string;
  dateCreated: string;
  email: string;
  id: number;
  password: string;
  username: string;
}
interface Body {
  methode?: string;
  password?: string;
  username?: string;
  email: string;
}

export function register(_req: Request, res: Response): void {
  res.render('pages/register', { register: false, user: undefined });
}

export function login(_req: Request, res: Response): void {
  res.render('pages/login', { register: true, user: undefined });
}

export function user(req: Request, res: Response): void {
  const { cookies }: { cookies: Record<string, string> } = req;

  let userDb: User | undefined;
  if (cookies['__SESSION_TOKEN']) {
    const token = validateToken(cookies['__SESSION_TOKEN']);
    if (token?.exp && token.exp > Math.floor(Date.now() / 1000)) {
        userDb = new Database('Database/users.db')
        .prepare(`SELECT id, username, email, dateCreated, avatar FROM Users WHERE id = ?`)
        .get(token['userId']) as User | undefined;
    }
  }

  if (!user) return res.render('pages/register', { register: false, user: undefined });
  res.render('pages/user', { user: userDb });
}

export function delete_(_req: Request, res: Response): void {
  res.render('pages/delete', { succes: undefined, user: undefined });
}

export function deleteConfirm(req: Request, res: Response): Response | void {
  const { token } = req.params;
  if (!token) return res.status(404).json({ Error: 'Missing token' });
  const checkToken = validateToken(token);

  if (!checkToken?.exp) return res.status(404).json({ Error: 'Validate URL not found' });
  if (checkToken.exp < Math.floor(Date.now() / 1000)) return res.status(400).json({ Error: 'Validate URL expired' });

  const db = new Database('Database/users.db');
  const user = db.prepare(`SELECT username FROM Users WHERE id = ?`).get(checkToken['userId']) as User | undefined;

  if (!user) return res.status(404).json({ Error: 'User not found' });

  switch (checkToken['type']) {
    case 'delete':
      db.prepare('DELETE FROM Users WHERE username = ?').run(user.username);
      return res.status(200).clearCookie('__SESSION_TOKEN').redirect('/');
  }
}

export function validate(req: Request, res: Response): Response | void {
  const { email, methode, password }: Body = req.body;

  if (!email || !password) return res.status(400).json({ Error: 'Missing parameters' });

  const user = new Database('Database/users.db')
    .prepare(`SELECT username, id, email, password FROM Users WHERE email = ?`)
    .get(email) as User | undefined;

  if (!user) return res.status(404).json({ Error: 'User not found' });

  compare(password, user.password, (_err, resBcrypt) => {
    if (!resBcrypt) res.status(403).json({ Error: 'Invalid Password' });
    else {
      switch (methode) {
        case 'delete':
          sendMail({
            email: user.email,
            htmlPart: `
            <center>
                <a href="http://localhost/users/delete/${generateValidateToken(
                  user,
                  'delete'
                )}" target="_blank"">Confirm account deletion</a>
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

export function createAccount(req: Request, res: Response): Response | void {
  const { email, password, username }: Body = req.body;

  if (!username || !email || !password) return res.status(400).json({ Error: 'Missing parameter' });
  if (username.length <= 2 || username.length >= 28)
    return res.status(400).json({ Error: 'Wrong username/password (must be length 2 - 28)' });
  if (!USERNAME_REGEX.test(username.trim()))
    return res.status(400).json({ Error: 'Wrong username (any special caracter)' });
  if (!PASSWORD_REGEX.test(password)) return res.status(400).json({ Error: 'Wrong password' });
  if (!EMAIL_REGEX.test(email)) return res.status(400).json({ Error: 'Wrong email' });

  const db = new Database('Database/users.db');

  if (
    db.prepare('SELECT 1 FROM Users WHERE email = ? LIMIT 1').pluck().get(email) ||
    db.prepare('SELECT 1 FROM Users WHERE username = ? LIMIT 1').pluck().get(username.trim())
  )
    return res.status(409).json({ Error: 'User already exist' });

  hash(password, 5, (_err, bcryptedPassword) => {
    db.prepare('INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?)').run(
      null,
      email,
      username.trim(),
      bcryptedPassword,
      'null',
      Date.now()
    );
    return res.status(201).redirect('/');
  });
}

export function connectAccount(req: Request, res: Response): Response | void {
  const { email, password }: Body = req.body;

  if (!email || !password) return res.status(400).json({ Error: 'Missing parameters' });
  const user = new Database('Database/users.db')
    .prepare(`SELECT id, password FROM Users WHERE email = ?`)
    .get(email) as User | undefined;

  if (!user) return res.status(404).json({ Error: 'User not found' });

  compare(password, user.password, (_err, resBcrypt): Response | void => {
    if (!resBcrypt) return res.status(403).json({ Error: 'Invalid Password' });

    const token = generateTokenUser(user);
    res.cookie('__SESSION_TOKEN', token, { httpOnly: false, maxAge: 10 * 60 * 1000, sameSite: 'lax', secure: true });

    res.status(201).redirect('/');
  });
}

export function logoutAccount(_req: Request, res: Response): void {
  res.status(200).clearCookie('__SESSION_TOKEN').redirect('/');
}
