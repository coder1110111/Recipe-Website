const User = require('../models/user')
const path = require('path');

exports.getProfilePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'profile.html'));
}

exports.getProfileInfo = async (req, res) => {
    const visiterId = req.params.id;

    const accountData = await User.findOne({
        where: {id: visiterId}
    });
    res.status(200).json({accountData});
}