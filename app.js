import "dotenv/config";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
// import { PORT } from "./src/config/config.js";
import { buildAdminRouter, admin } from "./src/config/setup.js";

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = Fastify();

  await buildAdminRouter(app);

  const PORT = process.env.PORT || 3000;

  // const PORT2 =
  //   "mongodb+srv://manishapoddar12597:awl4OlzMBFOTbWdO@cluster1.1as59.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Blinket Started on http://localhost:${PORT}${admin.options.rootPath}`
      );
    }
  });
};

start();
