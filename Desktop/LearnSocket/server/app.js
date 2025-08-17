import express from "express"
import {Server} from 'socket.io'
import {createServer} from "http"


const port =3000

const app = express()
const server=createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }  // this is not using the cors package but something provided by socket 
})

//app.use(cors()) if we make this middleware and pass everything such as origin and all still will work will be used when we are using apis

app.get("/",(req,res)=>{
   res.send("Hello world ")
})

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room); // join the socket to the room
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("message", ({ message, room }) => {
    console.log(`Message from ${socket.id} in room ${room}: ${message}`);
    // Send message only to the room
    io.to(room).emit("received_message", { message, sender: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});


server.listen(port,()=>{
    console.log("Server is running on port 3000")
})  //why server.listen and not app becasue the socket is in app not server 