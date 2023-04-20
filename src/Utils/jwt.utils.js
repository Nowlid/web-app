import pkg from 'jsonwebtoken';
import key from '../../key.json' assert { type: 'json' };
const {sign, verify} = pkg;

export default {
    generateTokenUser: (user) => {
        return sign({
            userId: user.id,
        },
        key.JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },
}