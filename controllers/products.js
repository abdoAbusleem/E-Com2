const Product = require("../models/product");
const Category = require("../models/category");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../Enums/httpStatusText");
const appError = require("../utils/appError");
const userRoles = require("../Enums/userRoles");
const message = require("../Enums/errorMessage");

const createProduct = asyncWrapper(async (req, res, next) => {
  const { productName, description, price, category, countInStock, brand } =
    req.body;

  const oldProduct = await Product.findOne({ productName });
  if (oldProduct) {
    const error = appError.create(
      message.productAlreadyExists,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const findCategory = await Category.findById(category);

  if (!findCategory) {
    const error = appError.create(
      message.categoryNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const baseUrl = req.protocol + "://" + req.get("host") + "/uploads/";
  const newProduct = new Product({
    merchant: req.currentUser.id,
    productName,
    description,
    thumbnail: baseUrl + req.files.thumbnail[0].filename,
    images: req.files.images.map((file) => baseUrl + file.filename),
    price,
    category,
    countInStock,
    brand,
  });

  await newProduct.save();

  return res.status(201).send({ status: httpStatusText.SUCCESS });
});

const productList = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit;
  const page = query.page;
  const skip = (page - 1) * limit;
  let productList = {};

  if (req.currentUser.role == userRoles.ADMIN) {
    productList = await Product.find()
      .select(" _id productName thumbnail price averageRating ")
      .limit(limit)
      .skip(skip);
  } else {
    productList = await Product.find({ merchant: req.currentUser.id })
      .select(" _id productName thumbnail price averageRating")
      .limit(limit)
      .skip(skip);
  }

  if (productList.length == 0) {
    const error = appError.create(
      message.productNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).json({ status: httpStatusText.SUCCESS, productList });
});

const getSingleProduct = asyncWrapper(async (req, res, next) => {
  let product = {};

  if (req.currentUser.role == userRoles.ADMIN) {
    product = await Product.findOne({ _id: req.params.id }).populate([
      { path: "category" },
      {
        path: "ratings",
        select: "-product",
        populate: {
          path: "user",
          select: ["firstName", "lastName"], // Only include the 'name' field of the user
        },
      },
      { path: "brand" },
    ]);
  } else {
    product = await Product.findOne({
      merchant: req.currentUser.id,
      _id: req.params.id,
    }).populate([
      { path: "category" },
      {
        path: "ratings",
        select: "-product",
        populate: {
          path: "user",
          select: ["firstName", "lastName"], // Only include the 'name' field of the user
        },
      },
      { path: "brand" },
    ]);
  }

  if (!product) {
    const error = appError.create(
      message.productNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).send({ status: httpStatusText.SUCCESS, product });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  await Product.updateOne(
    { _id: req.params.id, merchant: req.currentUser.id },
    { $set: { ...req.body } }
  );

  const product = await Product.findOne({
    merchant: req.currentUser.id,
    _id: req.params.id,
  });

  if (!product) {
    const error = appError.create(
      message.productNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).send({ status: httpStatusText.SUCCESS });
});

const updateProductCategory = asyncWrapper(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    const error = appError.create(
      message.categoryNotFound,
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  await Product.updateOne(
    { _id: req.params.id, merchant: req.currentUser.id },
    { $set: { category: req.body.category } }
  );

  const product = await Product.findOne({
    _id: req.params.id,
    merchant: req.currentUser.id,
  }).populate("category");

  if (!product) {
    const error = appError.create(
      message.productNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).send({ status: httpStatusText.SUCCESS, product });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
  let product = {};

  if (req.currentUser.role == userRoles.ADMIN) {
    product = await Product.findOne({ _id: req.params.id });
  } else {
    product = await Product.findOne({
      merchant: req.currentUser.id,
      _id: req.params.id,
    });
  }

  if (!product) {
    const error = appError.create(
      message.productNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  await Product.deleteOne(product);

  res.status(200).send({ status: httpStatusText.SUCCESS, data: null });
});

const productCount = asyncWrapper(async (req, res, next) => {
  const productCount = await Product.countDocuments({
    merchant: req.currentUser.id,
  });

  if (productList.length == 0) {
    const error = appError.create(
      message.productNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).json({ status: httpStatusText.SUCCESS, productCount });
});

module.exports = {
  createProduct,
  productList,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  productCount,
  updateProductCategory,
};
