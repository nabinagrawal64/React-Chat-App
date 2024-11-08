//server initiate
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const ContactRoutes = require("./routes/ContactRoute");
const { setupSocket } = require("./socket");
const dbConnect = require("./config/database");
const MessageRoutes = require("./routes/MessagesRoute");

const app = express();
const PORT = process.env.PORT || 3001;

//load config from env file
dotenv.config();

//enable cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))

//use cookie parser middleware
app.use(cookieParser());

//middleware 
app.use(express.json());

//routes
app.use("/api/auth", authRoutes)
app.use("/api/contacts", ContactRoutes)
app.use("/api/messages", MessageRoutes)

//activate the server
const server = app.listen(PORT, () => {
    console.log(`server started Successfully at ${PORT}`);
})
setupSocket(server);

//connect to the database
dbConnect();

//default Route
app.get('/',(req,res) => {
    res.send(`<h1> This is Homepage </h1>`);
})


