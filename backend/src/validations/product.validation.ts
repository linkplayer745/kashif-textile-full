// src/validations/product.validation.ts

import Joi from 'joi';

const variantOptionSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().optional(),
});

const addProduct = {
  body: Joi.object({
    categoryId: Joi.string().hex().length(24).required(),
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    discountedPrice: Joi.number().min(0).optional(),
    description: Joi.string().allow(''),
    attributes: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    variants: Joi.object()
      .pattern(Joi.string(), Joi.array().items(variantOptionSchema))
      .optional(),
  }),
};

const productValidation = {
  addProduct,
};

export default productValidation;
