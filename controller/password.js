const bcrypt = require('bcrypt');
const path = require('path');

const LinkTable = require('../models/linktable');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getResetPassword = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'reset-password.html'));
}

exports.postResetPassword = async(req, res) => {
    const id = req.params.linkTableId;
    const t = await sequelize.transaction();
    const password = req.body.New_Password;

    const checkLink = await LinkTable.findOne({where: {id, isActive:'true'}});
    //console.log(checkLink);
    if(!checkLink) {
        return res.status(400).json({message: 'Link is invalid or Expired!'});
    }
    else {
        checkLink.update({isActive: 'false'}, {transaction: t});
        bcrypt.hash(password, 10, async(error, hash) => {
            console.log(error);

            const user = await User.findOne({
                where: {id: checkLink.userId}
            });

            await user.update({password: hash}, {transaction: t});

            await t.commit();
            res.status(201).json({message: 'Password Updated!'});
        })
    }
}