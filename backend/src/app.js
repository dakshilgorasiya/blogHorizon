import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

// route imports
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import reportRouter from "./routes/report.routes.js";
import followRouter from "./routes/follow.routes.js";
// import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";

// routes declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/follows", followRouter);
// app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);

export { app };
