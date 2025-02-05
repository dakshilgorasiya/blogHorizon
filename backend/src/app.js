import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// express app
const app = express();

// middlewares

// to allow cross origin requests
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// to parse json data in the request body
app.use(
  express.json({
    limit: "16kb",
  })
);

// to parse form data in the request body
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// to serve static files
app.use(express.static("public"));

// to parse cookies in the request headers
app.use(cookieParser());

// route imports
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import reportRouter from "./routes/report.routes.js";
import followRouter from "./routes/follow.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";

// routes declarations
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likeRouter);

export { app };
