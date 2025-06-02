import Joi from 'joi';

export interface UpdateUserDetailsRequest {
  userId: string;
  name?: string;
  details: {
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

const updateUserDetails = {
  body: Joi.object().keys({
    name: Joi.string().optional().trim(),
    details: Joi.object()
      .keys({
        phone: Joi.string().required().min(10).messages({
          'string.pattern.base': 'Phone number must be a valid format',
        }),
        address: Joi.string().required().min(5).max(200).trim(),
        city: Joi.string().required().min(2).max(50).trim(),
        state: Joi.string().required().min(2).max(50).trim(),
        country: Joi.string().required().min(2).max(50).trim(),
        postalCode: Joi.string().required().min(3).max(10).trim(),
      })
      .required(),
  }),
};

export default {
  updateUserDetails,
};
