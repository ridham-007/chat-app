const User = require('../model/UserModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const {
            username, email, password
        } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({ msg: "Username already used", status: false })
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already used", status: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        delete user.password;
        return res.json({ status: true, user });
    }
    catch (exeption) {
        next(exeption)
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const {
            username, password
        } = req.body;
        const userData = await User.findOne({ username });
        if (!userData) {
            return res.json({ msg: "Incorrect Username or password", status: false })
        }
        const isValidPassword = await bcrypt.compare(password, userData.password);
        if (!isValidPassword) {
            return res.json({ msg: "Incorrect Username or password", status: false })
        }
        // delete userData.password;
        return res.json({ status: true, user: userData });
    }
    catch (exeption) {
        next(exeption)
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const {
            id,
        } = req.params;
        const {
            image
        } = req.body;
        const userData = await User.findByIdAndUpdate(id, {
            isAvatarImageSet: true,
            avatarImage: image,
        });
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    }
    catch (exeption) {
        next(exeption)
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const data = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
        ]);
        return res.json(data);
    } catch (ex) {
        next(ex)
    }
}