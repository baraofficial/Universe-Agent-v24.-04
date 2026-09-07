import re

with open("server.ts", "r") as f:
    content = f.read()

target = """    // Broadcast incoming messages to all other clients
    socket.on("room_message", (data) => {
      // Send to everyone else
      socket.broadcast.emit("room_message", data);
    });"""

replacement = """    // Broadcast incoming messages to all other clients
    socket.on("room_message", (data) => {
      // Send to everyone else
      socket.broadcast.emit("room_message", data);
    });

    socket.on("update_room_message", (data) => {
      socket.broadcast.emit("update_room_message", data);
    });"""

content = content.replace(target, replacement)

with open("server.ts", "w") as f:
    f.write(content)
