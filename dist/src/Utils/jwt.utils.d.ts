import type { JwtPayload } from 'jsonwebtoken';
interface User {
    id: number;
}
export declare function generateTokenUser(user: User): string | undefined;
export declare function generateValidateToken(user: User, type: string): string | undefined;
export declare function validateToken(token: string): JwtPayload | undefined;
export {};
//# sourceMappingURL=jwt.utils.d.ts.map