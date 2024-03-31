import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import likeRouter from "./routes/like.route.js";
import commentRouter from "./routes/comment.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

export { app };
