const express =require("express")
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute")
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const Path = "./build"
app.use(cors());
app.use(
    express.static(path.resolve(__dirname, "./build"))
  );

app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoutes)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connetion Successfull");
}).catch((err) => {
    console.log(err.message);
});
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});


//so first we had the connection and whenever there is a connection will store the chatsocket inside the global chatsocket
//and now whenever we emit the add user from the frontend
//whenever the user is logged in will stablis the socket connection by add user
//so will wrap the userid and currentuserid and will set it inside the Map
//now whenever there is a send message socket event is emited 
//so what will do is whenever it is emitted we have passed data
//so this data whould have the to and the message
//so first will check is the message that has to be sent to the user is online from the online users will check it
// and if it is online then we will emit the message to that user by the message recieved event
//and if the user want not be online  than it will be store in the database
//and if he is online that whould be store in the database plus we will recieved the message at that moment
// so our server side is complete


const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

//will store all of our online user inside the map
global.onlineUsers = new Map();

//will get the socket inside the callback function
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        // console.log("sendmsg",{data});
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    });
});