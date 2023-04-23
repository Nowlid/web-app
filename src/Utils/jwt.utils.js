import pkg from 'jsonwebtoken';
import key from '../../key.json' assert { type: 'json' };
const {sign, verify} = pkg;

export default {
    
    /**
     * Generate a token for user
     * @param {Object} user 
     * @returns token
     */
    generateTokenUser: (user) => {
        return sign({
            userId: user.id,
        },
        key.JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },

    /**
     * Generate a token for Validate URL
     * @param {Object} user 
     * @param {String} type 
     * @returns token
     */
    generateValidateToken: (user, type) => {
        return sign({
            userId: user.id,
            type: type,
            exp: Math.floor(Date.now() / 1000) + (10 * 60)
        }, key.JWT_SIGN_SECRET)
    },

    /**
     * Check token
     * @param {String} token 
     * @returns Object || undefined
     */
    validateToken: (token) => {
        if(token) {
            try {
            const jwtToken = verify(token, key.JWT_SIGN_SECRET);
            return jwtToken;
            } catch(err) { }
        }
    }
}