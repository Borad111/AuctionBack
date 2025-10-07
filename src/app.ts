  import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from "express";
  import cors from "cors";
  import helmet from "helmet";
  import morgan from "morgan";
  import rateLimit from "express-rate-limit";
  import compression from "compression";
  import hpp from "hpp";
  import dotenv from "dotenv";
  import cookieParser from "cookie-parser";
  import * as Sentry from "@sentry/node";
  import env from "./config/env";
  import AuthRouter from "./modules/auth/auth.routes";
  import AuctionRouter from "./modules/auction/auction.route";
  import { sentryUserContext } from "./middlewares/sentryUser.middleware";

  dotenv.config();

  const app: Application = express();

  /* --------------------  SENTRY INIT  -------------------- */
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: env.NODE_ENV,
    release: "auction-backend@1.0.0", // TODO: automate via CI/CD or package.json
    tracesSampleRate: env.NODE_ENV === "production" ? 0.3 : 1.0, // 30% in prod
  });

  /* --------------------  SECURITY  -------------------- */
  app.set("trust proxy", 1); // trust first proxy
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
          imgSrc: ["'self'", "data:", "https://your-bucket.s3.amazonaws.com"],
          connectSrc: ["'self'", env.FRONTEND_URL || "http://localhost:3000", "ws:"],
        },
      },
    })
  );
  app.use(hpp());
  app.use(cookieParser());

  /* --------------------  SENTRY HANDLERS  -------------------- */
  app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  app.use(Sentry.Handlers.tracingHandler() as express.RequestHandler);
  app.use(sentryUserContext);
  /* --------------------  LOGGING  -------------------- */
  if (env.NODE_ENV !== "test") {
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  /* --------------------  BODY PARSING  -------------------- */
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  /* --------------------  PERFORMANCE  -------------------- */
  app.use(compression());
  
  /* --------------------  CORS  -------------------- */
  app.use(
    cors({
      origin: env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    })
  );

  /* --------------------  RATE LIMITING (optional)  -------------------- */
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  }));

  /* --------------------  ROUTES  -------------------- */
  app.get("/health", (_req, res) => {
    try {
      res.status(200).json({ status: "ok" });
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ status: "error" });
    }
  });

  app.get("/", (_req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/auction", AuctionRouter);

  /* --------------------  404 HANDLER  -------------------- */
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const err: any = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
    err.status = 404;
    next(err);
  });

  /* --------------------  ERROR HANDLING  -------------------- */
  app.use(Sentry.Handlers.errorHandler() as ErrorRequestHandler);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  if (env.NODE_ENV !== "production") {
    console.error(err);
    return res.status(status).json({ success: false, message, stack: err.stack });
  }

  return res.status(status).json({ success: false, message });
});

  
  /* --------------------  PROCESS-LEVEL SAFETY NET  -------------------- */
  process.on("unhandledRejection", (reason) => {
    Sentry.captureException(reason);
    console.error("Unhandled Rejection:", reason);
  });

  process.on("uncaughtException", (err) => {
    Sentry.captureException(err);
    console.error("Uncaught Exception:", err);
  });

  export default app;
