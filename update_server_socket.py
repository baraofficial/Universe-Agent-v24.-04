import re

with open("server.ts", "r") as f:
    content = f.read()

import_socket = """import express from "express";
import http from "http";
import { Server } from "socket.io";"""

content = content.replace('import express from "express";', import_socket)

setup_socket = """  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("User connected to room chat:", socket.id);
    
    // Broadcast incoming messages to all other clients
    socket.on("room_message", (data) => {
      // Send to everyone else
      socket.broadcast.emit("room_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  const PORT = 3000;"""

content = content.replace("""  const app = express();\n  const PORT = 3000;""", setup_socket)

listen_socket = """  server.listen(PORT, "0.0.0.0", () => {"""
content = content.replace("""  app.listen(PORT, "0.0.0.0", () => {""", listen_socket)

with open("server.ts", "w") as f:
    f.write(content)
