const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { sign } = require('jsonwebtoken');

const getSendEmailCode = require('../util/sendEmailCode');
const getSendEmailLink = require('../util/sendEmailLink');
const getSendEmailVerfied = require('../util/sendEmailVerified');


router.get('/', async (req, res) => {
    
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});


router.post('/',
    [
        check('fullName', 'the name is required').exists().isLength({ min: 5, max: 50 }).withMessage('Name should be 5 to 50 chacacters').isString().withMessage('Name can only contain letters & numbers'),
        check('phone').exists().isLength({ min: 10, max: 10 }).withMessage('Name should be 3 to 50 chacacters').isString(),
        check('email', 'Invalid email').isEmail().normalizeEmail(),
        check('password', 'Password required').exists(),
        check('confimPassword', 'Confirm Password required').exists(),
    ],
    async (req, res) => {
        const error = validationResult(req);
        console.log(req.body)
        if (!error.isEmpty()) {
            return res.json(error);
        } else {
            try {
                const createString = uuid.v4();
                const setLink = `http://localhost:3000/confirm?id=${createString}`;

                const user = req.body;
                user.id = uuid.v4();
                const existingData = await Users.findOne({ where: { email: user.email } });

                if (existingData) {
                    return res.json({ error: "Email already exist" });
                }else if (user.password !== user.confimPassword) {
                    return res.json({ error: "Password don't match!!" });
                } else {
                    bcrypt.hash(user.password, 10).then((hash) => {
                        Users.create({
                            id: user.id,
                            fullName: user.fullName,
                            phone: user.phone,
                            email: user.email,
                            password: hash,
                            updateStatus: user.updateStatus,
                            verifyEmail: createString,
                        });
                    });
                    getSendEmailLink(setLink, user.email);
                    const accessToken = sign({ email: user.email, id: user.id,  fullName: user.fullName }, "AkageraCenter");
    
                    res.json({token: accessToken, fullName: user.fullName, id: user.id, email: user.email});
                
                }
                console.log("Code sent to email is: " + setLink)
                res.json("User registered");

            } catch (error) {
                console.log(error);
                res.json(error);
            }
        }
    });

    //verfying user
    router.put('/verify/:emailMsg', async (req, res) => {
        
            try {
                const verifyEmail = req.params.emailMsg;

                const user = await Users.findOne({ where: { verifyEmail } });

                if (!user) {
                    return res.json({ error: "User doesn't exist" })
                } else {
                    const setMsg = "Your account is verified, Now you can log in";

                    await Users.update({ verifyEmail: "verified" }, { where: { email: user.email } });

                    getSendEmailVerfied(setMsg, user.email);
                    console.log("Code sent to email is: " + setMsg);
                    res.json("Verified");
                }

            } catch (error) {
                res.json(error);
            }
        
    });
    //////////////////////////

//logging in
router.post('/login',
    [
        check('email', 'Invalid email').isEmail().normalizeEmail(),
        check('password', 'Password required').exists(),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.json(error);
        } else {
            try {
                const { email, password } = req.body;

                const user = await Users.findOne({ where: { email } });

                if (!user) {
                    return res.json({ error: "User doesn't exist" })
                }
                else if(user.verifyEmail !== "verified"){
                    return res.json({ error: "Your account is not verified" });
                }else{
                    bcrypt.compare(password, user.password).then((match) => {
                        if (!match) return res.json({ error: "Wrong username or password" });
    
                        const accessToken = sign({ email: user.email, id: user.id, fullName: user.fullName }, "AkageraCenter");
    
                        res.json({token: accessToken, fullName: user.fullName, id: user.id, email: user.email});
                        // res.json(accessToken);
    
                    });
                }

            } catch (error) {
                res.json(error);
            }
        }
    });

// send code for rest password
router.post('/confirmRestPassword',
    [
        check('email', 'Invalid email').isEmail().normalizeEmail(),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.json(error);
        } else {
            try {
                const { email } = req.body;

                const user = await Users.findOne({ where: { email } });

                if (!user) {
                    return res.json({ error: "User doesn't exist" })
                } else {
                    const setCode = Math.floor(10000 + Math.random() * 90000).toString();

                    await Users.update({ emailCode: setCode }, { where: { email: email } });

                    getSendEmailCode(setCode, email);
                    console.log("Code sent to email is: " + setCode);
                    res.json("Use the Code sent to email to reset password");
                }

            } catch (error) {
                res.json(error);
            }
        }
    });


//final reset password with code sent to email
router.post('/restPassword',
    [
        check('email', 'Invalid email').isEmail().normalizeEmail(),
        check('emailCode', 'Code sent to your email required').exists(),
        check('newPassword', 'New password required').exists(),
        check('confimNewPassword', 'confirm new password required').exists(),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.json(error);
        } else {
            try {
                const { email, emailCode, newPassword, confimNewPassword } = req.body;

                const user = await Users.findOne({ where: { email } });

                if (!user) {
                    return res.json({ error: "User doesn't exist" })
                }
                if (user.emailCode === emailCode) {
                    if (newPassword === confimNewPassword) {

                        bcrypt.hash(newPassword, 10).then((hash) => {
                            Users.update({ password: hash }, { where: { email: email } });
                        });
                        res.json("Password Updated");

                    }
                    else {
                        return res.json({ error: "Password do not match!!" });
                    }
                }else{
                    return res.json({error: "Copy and Paste the code sent to your email correctly"})
                }

            } catch (error) {
                res.json(error);
            }
        }
    });


module.exports = router;