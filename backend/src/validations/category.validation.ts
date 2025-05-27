import Joi from 'joi';

const addCategory = {
  body: Joi.object({
    name: Joi.string().trim().required().messages({
      'any.required': 'Category name is required',
      'string.empty': 'Category name cannot be empty',
    }),
    slug: Joi.string()
      .trim()
      .required()
      .pattern(/^[a-z0-9-]+$/)
      .messages({
        'any.required': 'Slug is required',
        'string.pattern.base':
          'Slug must only contain lowercase letters, numbers and hyphens',
      }),
    description: Joi.string().trim().allow('', null),
  }),
};
export type AddCategoryRequest = {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
};
const categoryValidation = {
  addCategory,
};
export default categoryValidation;
