import jwt from 'jsonwebtoken';
import { hashSync } from 'bcryptjs';
import userModel from '../../models/users';
import config from '../../../config';
import bcrypt from 'bcryptjs';
export const registerUser = async (req, res) => {
    let {
        firstName,
        lastName,
        emailId,
        password
    } = req.body;
    console.log("**************########");
    console.log(req.body);
    var hashedPassword = hashSync(password, 8);
    const newUser = new userModel({
        firstName,
        lastName,
        password: hashedPassword,
        emailId
    })
    console.log('newUser from body:', newUser);

    newUser.save(function (err, usernew) {
        if (err) {
            if (err.message.indexOf('duplicate') > -1) {
                res.json({ 'userNotCreated': true, 'duplicate phone number': true });
            }
            else {
                console.log("db saving error in auth", err);
                res.json({ "error": true });
            }

        }

        else {
            //lets create a auth token
            var token = jwt.sign({ id: usernew._id }, config.secret, { expiresIn: 86400 })
            //86400 , means token will expire in 1 day
            console.log('newUser:', usernew);
            res.status(200).send({ auth: true, token: token });
        }
    })
}

export const loginUser = async (req, res) => {
    console.log('login access requested by:', req.body.emailId);
    userModel.findOne({ emailId: req.body.emailId }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
}
export const logout = async (req, res) => {
    res.status(200).send({ auth: false, token: null });
}