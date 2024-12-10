const Brand = require("../models/brand");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../Enums/httpStatusText");
const appError = require("../utils/appError");
const message = require("../Enums/errorMessage");

const brandList = asyncWrapper(async (req, res, next) => {
  const brandList = await Brand.find();

  if (brandList.length == 0) {
    const error = appError.create(
      message.brandNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).json({ status: httpStatusText.SUCCESS, brandList });
});

const getSingleBrand = asyncWrapper(async (req, res, next) => {
  let brand = await Brand.findById(req.params.id, {
    __v: false,
  });

  if (!brand) {
    const error = appError.create(
      message.brandNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).send({ status: httpStatusText.SUCCESS, brand });
});

const createBrand = asyncWrapper(async (req, res, next) => {
  const { name, image } = req.body;

  const oldBrand = await Brand.findOne({ name: name });

  if (oldBrand) {
    const error = appError.create(
      message.brandAlreadyExists,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const baseUrl = req.protocol + "://" + req.get("host") + "/uploads/";
  const newBrand = new Brand({
    name,
    image: baseUrl + req.file.filename,
  });

  await newBrand.save();

  return res
    .status(201)
    .send({ status: httpStatusText.SUCCESS, Brand: newBrand });
});

const updateBrand = asyncWrapper(async (req, res, next) => {
  await Brand.updateOne({ _id: req.params.id }, { $set: { ...req.body } });

  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    const error = appError.create(
      message.brandNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  return res.status(200).send({ status: httpStatusText.SUCCESS, brand });
});

const deleteBrand = asyncWrapper(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    const error = appError.create(
      message.brandNotFound,
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }

  await Brand.deleteOne({ _id: req.params.id });

  res.status(200).send({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  brandList,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
