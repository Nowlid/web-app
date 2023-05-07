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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const routers_1 = require("./routers");
const jwt_utils_1 = require("./Utils/jwt.utils");
dotenv.config();
new better_sqlite3_1.default('Database/users.db')
    .prepare(`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, username TEXT, password TEXT, avatar TEXT, dateCreated TEXT)`)
    .run();
const app = (0, express_1.default)();
app.listen(80, () => {
    console.log('- Serveur in listen !');
});
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use((0, body_parser_1.json)());
app.use(express_1.default.static('./public'));
app.use((0, cookie_parser_1.default)());
app.set('views', './views/');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
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
    res.render('pages/home', { user: userDb });
});
app.use('/users', routers_1.userRoute);
//# sourceMappingURL=index.js.map