import { URL } from 'url';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from 'path'
import flash from 'connect-flash'
import session from 'express-session'

// Routes
import indexRoutes from "./routes/index.routes.js";
import loginRoutes from "./routes/login.routes.js";
import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser"

const __dirname = new URL('.', import.meta.url).pathname;

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

// Middlewares
app.use(
  cors({
    // origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

app.use(session({
  secret:'mysecretkey',
  saveUninitialized: true,
  resave: true,
}));
app.use(flash());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", indexRoutes)
app.use("/login", loginRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

export default app;
