import { Customer, DeliveryPartner } from "../../models/index.js";

import jwt from "jsonwebtoken";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refershToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  return { accessToken, refershToken };
};

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
      });
      await customer.save();
    }
    const { accessToken, refershToken } = generateTokens(customer);

    return reply.send({
      message: customer
        ? "Login Successfully"
        : "Customer created and logged in",
      accessToken,
      refershToken,
      customer,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occured ", error });
  }
};

export const loginDeliveryParter = async (req, reply) => {
  try {
    const { email, password } = req.body;
    console.log("checking req body", req.body);
    let deliveryParter = await DeliveryPartner.findOne({ email });
    console.log("checking deliveryParter data", deliveryParter);

    if (!deliveryParter) {
      return reply.status(404).send({ message: "Delivery partner not found" });
    }
    const isMatch = password === deliveryParter.password;
    if (!isMatch) {
      return reply.status(400).send({ message: "Invalid Credentials" });
    }
    const { accessToken, refershToken } = generateTokens(deliveryParter);

    return reply.send({
      message: deliveryParter
        ? "Login Successfully deliveryParter"
        : "Customer created and logged in",
      accessToken,
      refershToken,
      deliveryParter,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occured ", error });
  }
};

//TBD: if isAuth is activated, no need of refresh token.
export const refreshToken = async (req, reply) => {
  const { refershToken } = req.body;
  if (!refershToken) {
    return reply
      .status(401)
      .send({ message: "Refersh Token required ", error });
  }

  try {
    const decoded = JsonWebTokenError.verify(
      refershToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    let user;
    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "deliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return reply.status(403).send({ message: "Invalid role ", error });
    }

    if (!user) {
      return reply
        .status(403)
        .send({ message: "Invalid refresh Token ", error });
    }

    const { accessToken, refershToken: newRefershToken } = generateTokens(user);
    return reply.send({
      message: "Token Refereshed",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return reply.status(403).send({ message: "Invalid refresh Token", error });
  }
};

export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;
    console.log("checking userID", userId, role);
    let user;

    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return reply.status(403).send({ message: "Invalid role ", error });
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occured", error });
  }
};
