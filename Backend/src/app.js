const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./Routes/Auth.Routes");
const interviewRouter = require("./Routes/interview.routes");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieparser());

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
