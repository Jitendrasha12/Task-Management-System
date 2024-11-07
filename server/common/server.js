import express from "express";
import Mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import useragent from "express-useragent";
import Config from "config";
import { jwtStrategyApp } from "../helper/jwtHelper.js";
import passport from "passport";
import ErrorHandler from "../helper/errorHandler.js";
import apiErrorHandler from "../helper/apiErrorHandler.js";
const app = express();
const root = path.normalize(`${__dirname}/../..`);
class ExpressServer {
  constructor() {
    app.set("trust proxy", true);
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    app.get("/", (req, res) => {
      res.send("Welcome to Task Management System!");
    });

    passport.use("app", jwtStrategyApp);
    app.use(morgan("dev"));
    app.use(helmet());
    app.options("*", cors());
    // app.use(useragent.express());
    // app.use('/public', express.static('public'));
    app.use(useragent.express());
    // app.use(Express.static(`${root}/views`));
    app.use(
      cors({
        allowedHeaders: ["Content-Type", "token", "authorization"],
        exposedHeaders: ["token", "authorization"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );
  }

  router(routes) {
    routes(app);
    return this;
  }

  configureSwagger(swaggerDefinition) {
    const options = {
      // swaggerOptions: { authAction: { JWT: { name: "JWT", schema: { type: "apiKey", in: "header", name: "Authorization", description: "" }, value: "Bearer <JWT>" } } },
      swaggerDefinition,
      apis: [
        path.resolve(
          `${root}/server/api/v1/admin-dashboard/controllers/**/*.js`
        ),
        path.resolve(`${root}/server/api/v1/app/controllers/**/*.js`),
        path.resolve(`${root}/api.yaml`),
      ],
    };

    function requireLogin(request, response, next) {
      // console.log('request rec', process.env.swaggerLogin)
      if (Date.now() - process.env.swaggerLogin < 15 * 60 * 1000 || true) {
        next();
      } else {
        process.env.swaggerLogin = 0;
        response.sendFile(path.resolve(`${root}/views/login.html`));
      }
    }
    app.use(
      "/api-docs",
      requireLogin,
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(options))
    );

    app.get("/swagger.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerJSDoc(options));
    });

    return this;
  }

  handleError() {
    const errorHandler = new ErrorHandler({
     // logger,
      shouldLog: true,
    });
    app.use(apiErrorHandler);
    app.use(errorHandler.unhandledRequest());

    return this;
  }

  configureDb() {
    const databaseConfig = Config.get("database");
    return Mongoose.connect(databaseConfig.host)
      .then(() => {
        console.log("Mongodb connection established");
        return this;
      })
      .catch((err) => {
        console.log(`Error in mongodb connection ${err.message}`);
        return Promise.reject(err);
      });
  }

  listen(port) {
    http.createServer(app).listen(port, () => {
      console.log(`Secure app is listening @port ${port}`);
      // logger.info(`Secure app is listening @port ${port}`);
    });
    return app;
  }
}

export default ExpressServer;
