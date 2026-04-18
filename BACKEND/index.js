    import dotenv from "dotenv";
    import express from "express";
    import connectDB from "./Config/db.js";
    import cookieParser from "cookie-parser";
    import userRoutes from "./routes/UserRoutes.js";
    import jobRoutes from "./routes/JobRoutes.js";
    import { v2 as cloudinary } from "cloudinary";
    import fileUpload from "express-fileupload";
    import applicationRoutes from "./routes/ApplicationRoutes.js";
    import cors from "cors";

    dotenv.config();
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use(
    cors({
        origin: "http://localhost:5175",
        origin: "http://localhost:5173",
        credentials: true,
    }),
    );

    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    });

    app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/temp/",
    }),
    );

    app.use("/api/user", userRoutes);
    app.use("/api/job", jobRoutes);
    app.use("/api/application", applicationRoutes);

    const PORT = process.env.PORT || 3000;
    connectDB()
    .then(() => {
        console.log("Server connect to DB");

        app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((Error) => {
        console.log("Error in DB");
    });
