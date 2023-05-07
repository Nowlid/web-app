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
exports.sendMail = void 0;
const dotenv = __importStar(require("dotenv"));
const node_mailjet_1 = require("node-mailjet");
dotenv.config();
async function sendMail(options) {
    if (!process.env['MAILJET_EMAIL'] || !process.env['MAILJET_PUBLIC'] || !process.env['MAILJET_SECRET'])
        return;
    const mailjet = new node_mailjet_1.Client({ apiKey: process.env['MAILJET_PUBLIC'], apiSecret: process.env['MAILJET_SECRET'] });
    const data = {
        Messages: [
            {
                From: {
                    Email: process.env['MAILJET_EMAIL'],
                    Name: 'Nowlid'
                },
                HTMLPart: options.htmlPart,
                Subject: options.subject,
                TextPart: options.textPart,
                To: [
                    {
                        Email: options.email,
                        Name: 'User'
                    }
                ]
            }
        ]
    };
    const result = await mailjet.post('send', { version: 'v3.1' }).request(data);
    return result.body;
}
exports.sendMail = sendMail;
//# sourceMappingURL=email.utils.js.map