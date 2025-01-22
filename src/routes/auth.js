import fastify from "fastify";
import {
  loginCustomer,
  loginDeliveryParter,
  refreshToken,
  fetchUser,
} from "../controllers/auth/auth.js";
import { verifyToken } from "../middleware/auth.js";

export const authRoutes = async (fastify, options) => {
  fastify.post("/customer/login", loginCustomer);
  fastify.post("/delivery/login", loginDeliveryParter);
  fastify.post("/refresh-token", refreshToken);
  fastify.get("/user", { preHandler: [verifyToken] }, fetchUser);
};