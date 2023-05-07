import * as dotenv from 'dotenv';
import type { JwtPayload } from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';

dotenv.config();

interface User {
  id: number;
}

export function generateTokenUser(user: User): string | undefined {
  if (!process.env['JWT_SIGN_SECRET']) return;
  return sign(
    {
      userId: user.id
    },
    process.env['JWT_SIGN_SECRET'],
    {
      expiresIn: '1h'
    }
  );
}

export function generateValidateToken(user: User, type: string): string | undefined {
  if (!process.env['JWT_SIGN_SECRET']) return;
  return sign(
    {
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
      type,
      userId: user.id
    },
    process.env['JWT_SIGN_SECRET']
  );
}

export function validateToken(token: string): JwtPayload | undefined {
  if (!process.env['JWT_SIGN_SECRET']) return;
  try {
    const jwtToken = verify(token, process.env['JWT_SIGN_SECRET']);
    if (typeof jwtToken !== 'string') {
      return jwtToken;
    }
  } catch (err) {
    /* empty */
  }
  return;
}
