const Message = require('../models/MessageModel')
const { mkdirSync, renameSync } = require('fs');

exports.getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if(!user1 || !user2){
            return res.status(400).json({
                success: false,
                message: "Both users are required",
            });
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({timeStamp: 1});

        return res.status(200).json({
            success: true,
            message: "get the message Sucessfully",
            messages: messages,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "get message controller error",
        });
    }
}

exports.uploadFile = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "file is required",
            });
        }

        const date = Date.now();
        console.log("Backend se file: ",{file: req.file});

        let fileDir = `uploads/files/${date}`
        let fileName = `${fileDir}/${req.file.originalname}`;

        mkdirSync(fileDir, { recursive: true});
        renameSync(req.file.path, fileName)

        console.log("file name: ", fileName);

        return res.status(200).json({
            success: true,
            message: "File uploaded Sucessfully",
            filePath: fileName, 
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "File upload failed",
        });
    }
}