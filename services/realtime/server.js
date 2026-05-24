const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "*",
  },
});

console.log("Realtime engine running on port 4000");

setInterval(() => {
  io.emit("telemetry", {
    timestamp: Date.now(),
    anomalyScore: Math.random() * 100,
    county: "Nairobi",
  });
}, 3000);