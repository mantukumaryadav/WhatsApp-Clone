// import mongoose from "mongoose";
// import { Server } from "socket.io";
// import app from "./app.js";
// import logger from "./configs/logger.config.js";
// import SocketServer from "./SocketServer.js";
// //env variables
// const { DATABASE_URL } = process.env;
// const PORT = process.env.PORT || 8000;

// //exit on mognodb error
// mongoose.connection.on("error", (err) => {
//   logger.error(`Mongodb connection error : ${err}`);
//   process.exit(1);
// });

// //mongodb debug mode
// if (process.env.NODE_ENV !== "production") {
//   mongoose.set("debug", true);
// }

// //mongodb connection
// mongoose
//   .connect(DATABASE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     logger.info("Connected to Mongodb.");
//   });
// let server;

// server = app.listen(PORT, () => {
//   logger.info(`Server is listening at ${PORT}.`);
// });

// //socket io
// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: process.env.CLIENT_ENDPOINT,
//   },
// });
// io.on("connection", (socket) => {
//   logger.info("socket io connected successfully.");
//   SocketServer(socket, io);
// });

// //handle server errors
// const exitHandler = () => {
//   if (server) {
//     logger.info("Server closed.");
//     process.exit(1);
//   } else {
//     process.exit(1);
//   }
// };

// const unexpectedErrorHandler = (error) => {
//   logger.error(error);
//   exitHandler();
// };
// process.on("uncaughtException", unexpectedErrorHandler);
// process.on("unhandledRejection", unexpectedErrorHandler);

// //SIGTERM
// process.on("SIGTERM", () => {
//   if (server) {
//     logger.info("Server closed.");
//     process.exit(1);
//   }
// });




import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app.js";
import logger from "./configs/logger.config.js";
import SocketServer from "./SocketServer.js";
import crypto from "crypto"; // Import the crypto module

// Generate ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET
const generateSecret = (length) => {
    return crypto.randomBytes(length).toString('hex');
};

const ACCESS_TOKEN_SECRET = generateSecret(32);
const REFRESH_TOKEN_SECRET = generateSecret(32);

// Store them as environment variables
process.env.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
process.env.REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET;

// Print the secrets to the console
// console.log('ACCESS_TOKEN_SECRET:', ACCESS_TOKEN_SECRET);
// console.log('REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET);

//env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

//exit on mognodb error
mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error : ${err}`);
  process.exit(1);
});

//mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

//mongodb connection
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to Mongodb.");
  });
let server;

server = app.listen(PORT, () => {
  logger.info(`Server is listening at ${PORT}.`);
});

//socket io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_ENDPOINT,
  },
});
io.on("connection", (socket) => {
  logger.info("socket io connected successfully.");
  SocketServer(socket, io);
});

//handle server errors
const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
