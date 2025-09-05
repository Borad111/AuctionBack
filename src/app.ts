import express   from 'express';
import  type { Application, Request,Response ,NextFunction} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import hpp from 'hpp';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import env from './config/env';
import AuthRouter from './modules/auth/auth.routes';
const app: Application = express();


dotenv.config();
//security middlewares
app.set('trust proxy', 1); // trust first proxy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https://your-bucket.s3.amazonaws.com"],
        connectSrc: ["'self'", env.FRONTEND_URL || 'http://localhost:3000',"ws:"],
      },
    },
  })
);
app.use(hpp());
app.use(cookieParser());

//logging middlewares
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

//body parsing middlewares
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({ extended: true,limit:'5mb' }));


//compression 
app.use(compression());

//cors and rate limiting
app.use(cors({
      origin: env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
}));

// Rate limiting
  // app.use(rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //     standardHeaders: true,
  //     legacyHeaders: false
  // }));

//Health check route
app.get('/health', (_req, res:Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', ( _req,res: Response) => {
    res.send('Hello World!');
}); 

app.use('/api/v1/auth',AuthRouter);

//404 error handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  const err: any = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
});


//Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  if (env.NODE_ENV !== 'production') {
    console.error(err);
    return res.status(status).json({
      success: false,
      message,
      stack: err.stack
    });
  }

  // Production error response
  return res.status(status).json({
    success: false,
    message
  });
});




export default app;

