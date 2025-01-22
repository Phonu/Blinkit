import mongoose from "mongoose";
import { Branch, Category, Product } from "./src/models/index.js";
import "dotenv/config";
import { categories, products } from "./seedData.js";

async function seedDatabase() {
  try {
    console.log("URIIIII", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    // await Branch.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);

    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    const productWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    await Product.insertMany(productWithCategoryIds);

    console.log("DATABASE SEEDED SUCCESSFULLY ✅");
  } catch (error) {
    console.error("Error Seeding database::", error);
  }
}

seedDatabase();