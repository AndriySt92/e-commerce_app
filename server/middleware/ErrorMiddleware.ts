import express from 'express'

const notFound = (req: express.Request , res: express.Response, next: express.NextFunction) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  const errorHandler = (err: any, _: any, res: express.Response) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  export { notFound, errorHandler };