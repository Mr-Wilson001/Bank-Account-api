import Joi from "joi";

export const userInputSchema = Joi.object({
  firstName: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^(080|081|070|090|091)\d{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 11 digits and start with 080, 081, 070, 090, or 091.",
      "string.empty": "Phone number is required."
    }),
  dateOfBirth: Joi.string().required(),
});

export const accountValidationSchema = Joi.object({
  accountNumber: Joi.string()
    .pattern(/^20\d{8}$/) // starts with 20, then 8 more digits
    .required()
    .messages({
      "string.pattern.base": "Account number must be 10 digits and start with '20'.",
      "string.empty": "Account number is required."
    }),

  cardNumber: Joi.string()
    .pattern(/^51\d{14}$/)
    .required()
    .messages({
      "string.pattern.base": "Card number must be 16 digits and start with '51'.",
      "string.empty": "Card number is required."
    }),
});