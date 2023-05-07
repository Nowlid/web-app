"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateValidateToken = exports.generateTokenUser = void 0;
const dotenv = __importStar(require("dotenv"));
const jsonwebtoken_1 = require("jsonwebtoken");
dotenv.config();
function generateTokenUser(user) {
    if (!process.env['JWT_SIGN_SECRET'])
        return;
    return (0, jsonwebtoken_1.sign)({
        userId: user.id
    }, process.env['JWT_SIGN_SECRET'], {
        expiresIn: '1h'
    });
}
exports.generateTokenUser = generateTokenUser;
function generateValidateToken(user, type) {
    if (!process.env['JWT_SIGN_SECRET'])
        return;
    return (0, jsonwebtoken_1.sign)({
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        type,
        userId: user.id
    }, process.env['JWT_SIGN_SECRET']);
}
exports.generateValidateToken = generateValidateToken;
function validateToken(token) {
    if (!process.env['JWT_SIGN_SECRET'])
        return;
    try {
        const jwtToken = (0, jsonwebtoken_1.verify)(token, process.env['JWT_SIGN_SECRET']);
        if (typeof jwtToken !== 'string') {
            return jwtToken;
        }
    }
    catch (err) {
    }
    return;
}
exports.validateToken = validateToken;
//# sourceMappingURL=jwt.utils.js.map