import Product from "../../models/products.js";
export const getProductByCategoryID = async (req, reply) => {
  const { categoryId } = req.params;
  try {
    console.log("checking getProductByCategoryID", Product);
    const products = await Product.find({ category: categoryId })
      .select("-category")
      .exec();
    return reply.send(products);
  } catch (error) {
    return reply.status(500).send({ message: "An error occured", error });
  }
};
