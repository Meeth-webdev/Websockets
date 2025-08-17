import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Button, Container, TextField, Typography } from "@mui/material";

function App() {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const[room,setRoom]=useState("")
  const[socketId,setSocketId]=useState("")
  useEffect(() => {
    // Create connection only once
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      setSocketId(socketRef.current.id)
      console.log("connected", socketRef.current.id);
    });

    socketRef.current.on("welcome", (s) => {
      console.log(s);
    });

    socketRef.current.on("received_message", (data) => {
      console.log(data);
    });

    return () => {
      socketRef.current.disconnect(); // cleanup on unmount
    };
  }, []);
  const handleJoinRoom = () => {
  if (room && socketRef.current) {
    socketRef.current.emit("join_room", room);
    console.log("Joined room:", room);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socketRef.current) {
      socketRef.current.emit("message", {message,room});
      setMessage("");
    }
  };

  return (
    <div>
      <Container maxWidth='sm'>
        <Typography variant='h2' component='div' gutterBottom>
        {socketId}
        </Typography>
<form onSubmit={handleSubmit}>
  <TextField 
    value={message} 
    onChange={e => setMessage(e.target.value)} 
    label="Message" 
    variant="outlined"
  />
  <TextField 
    value={room} 
    onChange={e => setRoom(e.target.value)} 
    label="Room" 
    variant="outlined"
  />
  <Button onClick={handleJoinRoom} variant="contained" color="secondary">
    Join Room
  </Button>
  <Button type="submit" variant="contained" color="primary">
    Send
  </Button>
</form>
      </Container>
    </div>
  );
}

export default App;
