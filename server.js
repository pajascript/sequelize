"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const _USERS = require('./users.json');
const Op = Sequelize.Op;
const app = express();
const port = 8001;
const connection = new Sequelize('db', 'user', 'pass', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'db.sqlite',
    define: {
        freezeTableName: true
    }
});
const User = connection.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true
        }
    }
});
// app.get('/findAll', async (req: Request, res: Response) => {
//     try {
//         const users: UserInterface = await User.findAll({
//             where: {
//                 name: {
//                     [Op.like]: 'Ma%'
//                 }
//             }
//         })
//         (res as any).status(200).json(users)
//     } catch (error) {
//         (res as any).status(400).send(error)
//     }
// })
app.get('/findAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.findAll({
            where: {
                name: { [Op.like]: 'Ma%' }
            }
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}));
app.get('/findOne', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findByPk('5');
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}));
app.post('/post', (req, res) => {
    const newUser = req.body.user;
    User.create({
        name: newUser.name,
        email: newUser.email
    })
        .then((user) => res.status(200).json(user))
        .catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});
connection
    .sync({
    logging: console.log,
    force: true
})
    .then(() => {
    User.bulkCreate(_USERS)
        .then(() => {
        console.log("Add Users Success.");
    }).catch((err) => {
        console.log('Add Users Failed: ', err);
    });
})
    .then(() => {
    console.log('Connection to database established successfully.');
})
    .catch((err) => {
    console.log('Unable to connect to database. ', err);
});
app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});
