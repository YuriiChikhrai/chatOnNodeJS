global.Promise = require("bluebird");
const PORT = process.env.PORT || 7777;

const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const server = require("http").Server(app);
const io = require("socket.io")(server, { serveClient: true });
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const config = require("./config");

const passport = require("passport");
const { Strategy } = require("passport-jwt");

const { jwt } = require("./config");

passport.use(
  new Strategy(jwt, function(jwt_payload, done) {
    if (jwt_payload != void 0) {
      return done(false, jwt_payload);
    }
    done();
  })
);

mongoose.connect(config.mongo.url, config.mongo.options);
mongoose.set("debug", process.env.NODE_ENV !== "production");
mongoose.connection.on("error", e => {
  console.error("MongoDB connection error", e);
  process.exit(0);
});

nunjucks.configure("./client/views", {
  autoescape: true,
  express: app
});

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

app.use(cookieParser());

require("./router")(app);

require("./sockets")(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
