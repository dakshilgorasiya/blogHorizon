import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { logger } from "./utils/logger.js";

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

// Middleware to log each request
app.use((req, res, next) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  next();
});

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

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    status: err.statusCode || 500,
    stack: err.stack,
  });

  res.status(err.statusCode || 500).json(
    new ApiResponse({
      statusCode: err.statusCode || 500,
      message: err.message,
      data: null,
      success: false,
    })
  );
});

export { app };
