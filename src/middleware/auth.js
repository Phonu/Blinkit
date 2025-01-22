import jwt from "jsonwebtoken";

export const verifyToken = async (req, reply) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("authHeader", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded", decoded);
    req.user = decoded;
    return true;
  } catch (error) {
    return reply.status(403).send({ message: "Invalid or expried token" });
  }
};