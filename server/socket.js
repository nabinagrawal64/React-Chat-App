const {Server} = require("socket.io");
const Message = require("./models/MessageModel");

exports.setupSocket = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
            methods: ['GET', 'POST', ],
        }
    })

    const userSocketMap = new Map();

    const disconnectSocket = (socket) => {
        console.log(`client disconnecting: ${socket}`);
        for(const [userId, socketId] of userSocketMap.entries()) {
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                console.log(`User ${userId} disconnected from socket ${socket.id}`);
                break;
            }
        }
    }

    async function sendMessage(message) {
        try {
            const { sender, recipient } = message;
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);

            const createdMessage = await Message.create(message);
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate("recipient", "id email firstName lastName image color");

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("recieveMessage", messageData);
            }
            if (senderSocketId) {
                io.to(senderSocketId).emit("recieveMessage", messageData);
            } else {
                console.log("User not connected");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }


    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId

        if(userId){
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);
        } else{
            console.log("User not connected");
        }

        socket.on("sendMessage",sendMessage);
        socket.on("disconnect", () => disconnectSocket(socket));

    });

}
