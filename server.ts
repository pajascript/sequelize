const express = require('express');
const Sequelize = require('sequelize');
const { DataTypes } = Sequelize
import { User as UserInterface } from './interfaces/User'
const _USERS = require('./users.json')
const Op = Sequelize.Op

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

app.get('/findAll', async (req: Request, res: Response) => {
    try {
        const users: UserInterface[] = await User.findAll({
            where: {
                name: { [Op.like]: 'Ma%' }
            }
        });
        (res as any).status(200).json(users);
    } catch (error) {
        console.log(error);
        (res as any).status(400).send(error);
    }
});


app.get('/findOne', async (req: Request, res: Response) => {
    try {
        const user: UserInterface | null = await User.findByPk('5');
        if (user) {
            (res as any).status(200).json(user);
        } else {
            (res as any).status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        (res as any).status(400).send(error);
    }
});

app.post('/post', (req: Request, res: Response) => {
    const newUser: UserInterface = (req.body as any).user
    User.create({
        name: newUser.name,
        email: newUser.email
    })
        .then((user: UserInterface) => (res as any).status(200).json(user))
        .catch((err: Error) => {
            console.log(err);
            (res as any).status(400).send(err)
        })
})

connection
    .sync({
        logging: console.log,
        force: true
    })
    .then(() => {
        User.bulkCreate(_USERS)
            .then(() => {
                console.log("Add Users Success.")
            }).catch((err: Error) => {
                console.log('Add Users Failed: ', err)
            })
    })
    .then(() => {
        console.log('Connection to database established successfully.')
    })
    .catch((err: Promise< object | string >) => {
        console.log('Unable to connect to database. ', err)
    });

app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});