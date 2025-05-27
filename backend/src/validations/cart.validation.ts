import Joi from 'joi';

const addToCart = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
    selectedVariant: Joi.object().required(),
  }),
};

const removeFromCart = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    selectedVariant: Joi.object().required(),
  }),
};

const updateQuantity = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
    selectedVariant: Joi.object().required(),
  }),
};

const getCart = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const clearCart = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const cartValidation = {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
  clearCart,
};

export default cartValidation;
