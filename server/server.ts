import express from "express";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import ImportData from "./importData";

dotenv.config();
const app = express();
app.use(express.json());


const PORT = process.env.PORT || 5000;

//CONNECT MONDODB
mongoose
  .connect((process.env.MONGO_URL as string), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log('DB Connection Successfull'))
  .catch((err: String) => {
    console.error(err)
  })

  //API
  app.use("/api/import", ImportData);

  app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`)
  })