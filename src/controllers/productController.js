import { Product } from "../models/product.js"
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllProducts = async (req, res) => {
  const { page = 1, perPage = 8, sortBy = "createdAt", order = "desc", search } = req.query;

  const skip = (page - 1) * perPage;

  const productsQuery = Product.find();

  if (search) {
    productsQuery.find({ title: { $regex: search, $options: "i" }, });
  };

  if (sortBy) {
    productsQuery.sort({ [sortBy]: order === "asc" ? 1 : -1 });
  };

  const [totalItems, products] = await Promise.all([
    productsQuery.clone().countDocuments(),
    productsQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    products,
  });
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw createHttpError(404, "Product not found");
  };

  res.status(200).json(product)
};

export const createProduct = async (req, res) => {
  const product = await Product.create({ ...req.body })

  res.status(201).json(product);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id)

  if (!product) {
    throw createHttpError(404, "Product not found");
  };

  res.status(200).json(product);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    returnDocument: "after",
    runValidators: true,
  },
  );

  if (!product) {
    throw createHttpError(404, "Product not found");
  };

  res.status(200).json(product);
};

export const uploadProductImage = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    throw createHttpError(404, "No file")
  };

  const result = await saveFileToCloudinary(req.file.buffer);

  const product = await Product.findOneAndUpdate(
    { _id: id },
    { imageUrl: result.secure_url },
    { returnDocument: "after" },
  );

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  res.status(200).json({ url: product.imageUrl })
};
