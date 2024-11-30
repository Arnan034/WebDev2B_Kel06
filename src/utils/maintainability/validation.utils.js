const Joi = require('joi');

const schemas = {
  // User schemas
  userCreate: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  // Movie schemas
  movieCreate: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    releaseDate: Joi.date().required(),
    genre: Joi.string().required()
  }),

  // Add more schemas as needed
};

module.exports = schemas;