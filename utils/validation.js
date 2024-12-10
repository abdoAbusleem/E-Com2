const joi = require("joi");

//register
const validateRegiser = async (Request) => {
  let schema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string(),
    phone: joi.string().required(),
    country: joi.string().required(),
    email: joi
      .string()
      .email({ maxDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: joi.string().required(),
  });
  let { error } = await schema.validate(Request);
  return error;
};

const validateLogin = async (Request) => {
  let schema = joi.object({
    email: joi
      .string()
      .email({ maxDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: joi.string().required(),
  });
  let { error } = await schema.validate(Request);
  return error;
};

module.exports = {
  validateRegiser,
  validateLogin,
};
