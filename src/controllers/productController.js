import { Product } from "../models/product.js"
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllProducts = async (req, res) => {
  const { page = 1, perPage = 9, sortBy = "createdAt", order = "desc", search, category, size } = req.query;

  const pageNum = Number(page);
  const perPageNum = Number(perPage);
  const skip = (pageNum - 1) * perPageNum;

  const filter = {};

  if (search) {
    filter.title = ({ $regex: search, $options: "i" });
  };

  if (category && category !== "all") {
    filter.category = category;
  }

  if (size) {
    filter.sizes = size;
  }

  const countQuery = Product.find(filter).countDocuments();

  const productsQuery = Product.find(filter)
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(perPageNum);

  const [totalItems, products] = await Promise.all([
    countQuery,
    productsQuery,
  ]);

  const totalPages = Math.ceil(totalItems / perPageNum);

  res.status(200).json({
    page: pageNum,
    perPage: perPageNum,
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

  if (!req.files || req.files.length === 0) {
    throw createHttpError(404, "No file");
  }

  const results = await Promise.all(req.files.map((file) => saveFileToCloudinary(file.buffer)));

  const product = await Product.findOneAndUpdate(
    { _id: id },
    { imageUrl: results.map((result) => result.secure_url) },
    { returnDocument: "after" },
  );

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  res.status(200).json({ url: product.imageUrl })
};
