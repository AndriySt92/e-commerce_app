import { Request } from "express";

// Request types
export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>
export type RequestWithParams<T> = Request<T>

