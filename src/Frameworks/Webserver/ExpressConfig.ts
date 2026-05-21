import { Application } from "express";
import morgan from "morgan";

const expressConfig = (app: Application) => {
    app.use(morgan("dev"));
};

export default expressConfig