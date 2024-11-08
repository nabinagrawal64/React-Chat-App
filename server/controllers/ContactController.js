const { default: mongoose } = require('mongoose');
const User = require('../models/UserModel')
const Message = require('../models/MessageModel');

exports.searchContacts = async (req, res) => {
    try {
        const {searchTerm} = req.body;

        if(searchTerm === undefined || searchTerm === null){
            return res.status(400).json({
                success: false,
                message: "Search term is required",
            });
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^{}()|[\]\\]/g,
            '\\$&'
        );

        const regex = new RegExp(sanitizedSearchTerm,'i');

        const contacts = await User.find({
            $and: [
                { _id: {$ne: req.userId} },
                {
                    $or:[
                        {firstName: regex},
                        {lastName: regex},
                        {email: regex},
                    ]
                },
            ],
        })

        return res.status(200).json({
            success: true,
            message: "Contact fetched Sucessfully",
            contacts: contacts
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Contact fetched Failed",
        });
    }
}

exports.getContactsForDMList = async (req, res) => {
    try {

        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId },{ recipient: userId },]
                }
            },
            {
                $sort : { timeStamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: [ "$sender", userId ] },
                            then: "$recipient",
                            else: "$sender"
                        },
                    },
                    lastMessageTime: {
                        $first: "$timeStamp"
                    },
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'contactInfo'
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    email: '$contactInfo.email',
                    firstName: '$contactInfo.firstName',
                    lastName: '$contactInfo.lastName',
                    image: '$contactInfo.image',
                    color: '$contactInfo.color',
                    lastMessageTime: 1,
                },
            },
            {
                $sort: { lastMessageTime: -1 }
            }

        ])
        
        return res.status(200).json({
            success: true,
            message: "Contact fetched Sucessfully",
            contacts: contacts
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch contacts",
            error: error.message,
        });
    }
}

exports.getAllContacts = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }, "firstName lastName _id email") 

        const contacts = users.map(user => {
            label = user.firstName ? `${user.firstName} ${user.lastName}` : user.email
        });

        return res.status(200).json({
            success: true,
            message: "All Contact fetched Sucessfully",
            contacts: contacts
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "All Contact fetched Failed",
        });
    }
}