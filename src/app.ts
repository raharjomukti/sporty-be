import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.send("Sporty Beckend API is running");
});

app.get("/test-middleware", authenticate, (req, res) => {
    res.send("Hore, kamu bisa akses karena kamu punya token");
});

export default app;