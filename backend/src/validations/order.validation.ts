import Joi from 'joi';

const shippingFields = {
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().allow('', null),
  city: Joi.string().required(),
  postalCode: Joi.string().allow('', null),
  address1: Joi.string().required(),
  address2: Joi.string().allow('', null),
  shipToBilling: Joi.boolean().default(true),
  orderNotes: Joi.string().allow('', null),
};

const orderItem = Joi.object({
  product: Joi.string().hex().length(24).required(),
  //   name: Joi.string().required(),
  //   price: Joi.number().min(0).required(),
  quantity: Joi.number().min(1).required(),
  selectedVariant: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
});

export const createOrder = {
  body: Joi.object({
    // shipping (always required)
    ...shippingFields,

    items: Joi.array().items(orderItem).min(1).required(),
  }),
};

const orderValidation = {
  createOrder,
};

export default orderValidation;
