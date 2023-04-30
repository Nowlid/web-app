import pkg from 'jsonwebtoken';
import key from '../../key.json'
const {sign, verify} = pkg;
type User = {id: number}

export default {

    generateTokenUser: (user: User) => {
        return sign({
            userId: user.id,
        },
        key.JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },

    generateValidateToken: (user: User, type: string) => {
        return sign({
            userId: user.id,
            type: type,
            exp: Math.floor(Date.now() / 1000) + (10 * 60)
        }, key.JWT_SIGN_SECRET)
    },

    validateToken: (token: string) => {
        try {
            const jwtToken = verify(token, key.JWT_SIGN_SECRET);
            if(typeof jwtToken !== "string") {
                return jwtToken;
            }
        } catch(err) { }
    }
}