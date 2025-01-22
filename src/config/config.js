import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";

import { Admin } from "../models/index.js";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStorage = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

sessionStorage.on("error", (error) => {
  console.log("Session Store error", error);
});

export const authenticate = async (email, password) => {
  //abc abc
  //kunal 12345
  if (email && password) {
    if (email == "kunal" && password == "12345") {
      return Promise.resolve({ email: email, password: password });
    } else if (email == "abc" && password == "abc") {
      return Promise.resolve({ email: email, password: password });
    }
  }
  return null;
};

export const PORT = process.env.MONGO_URI || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
