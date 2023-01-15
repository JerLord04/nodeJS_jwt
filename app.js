require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')

const app = express();

app.use(express.json());

//Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is required")
        }
        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password,user.password))){
            const token = jwt.sign(
                {user_id : user._id,email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )
            user.token = token;
            res.status(200).json(user)
        }else{
            res.status(400).send("Invalid Credentials")
        }
    } catch (error) {

    }
})

//Register
app.post('/register', async (req, res) => {
    try {
        // get user input
        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User already exist.Please login")
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        })
        //Create token 
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: '2h'
            }
        )
        //save user token
        user.token = token;
        res.status(201).json(user)

    } catch (error) {
        console.log(error);
    }
})

app.post('/welcome' ,auth, (req,res) => {
    res.send("Hello")
})


module.exports = app;