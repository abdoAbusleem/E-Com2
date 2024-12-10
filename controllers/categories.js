const Category = require("../models/category");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../Enums/httpStatusText");
const appError = require("../utils/appError");
const message = require("../Enums/errorMessage");

const categoryList = asyncWrapper(async (req, res, next) => {
  const categoryList = await Category.find();

  if (categoryList.length == 0) {
    const error = appError.create(
      message.categoryNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { categoryList } });
});

const getSingleCategory = asyncWrapper(async (req, res, next) => {
  let category = await Category.findById(req.params.id, {
    __v: false,
  });

  if (!category) {
    const error = appError.create(
      message.categoryNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).send({ status: httpStatusText.SUCCESS, category });
});

const createCategory = asyncWrapper(async (req, res, next) => {
  const { name, image } = req.body;

  const oldCategory = await Category.findOne({ name: name });

  if (oldCategory) {
    const error = appError.create(
      message.categoryAlreadyExists,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const baseUrl = req.protocol + "://" + req.get("host") + "/uploads/";

  const newCategory = new Category({
    name,
    image: baseUrl + req.file.filename,
  });

  await newCategory.save();

  return res
    .status(201)
    .send({ status: httpStatusText.SUCCESS, category: newCategory });
});

const updateCategory = asyncWrapper(async (req, res, next) => {
  await Category.updateOne({ _id: req.params.id }, { $set: { ...req.body } });

  const category = await Category.findById(req.params.id);

  if (!category) {
    const error = appError.create(
      message.categoryNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).send({ status: httpStatusText.SUCCESS, category });
});

const deleteCategory = asyncWrapper(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    const error = appError.create(
      message.categoryNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  await Category.deleteOne({ _id: req.params.id });

  res.status(200).send({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  categoryList,
  createCategory,
  deleteCategory,
  getSingleCategory,
  updateCategory,
};
