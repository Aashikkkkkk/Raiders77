const { body, validationResult } = require("express-validator");

const itemValidator = [
  [
    body("name")
      .exists()
      .withMessage("Name is missing")
      .notEmpty()
      .withMessage("Name is empty")
      .isString()
      .withMessage("Name must be a string"),
    body("price")
      .exists()
      .withMessage("Price is missing")
      .notEmpty()
      .withMessage("Price is empty")
      .isNumeric()
      .withMessage("Price name must be a number"),
    body("description")
      .exists()
      .withMessage("Description is missing")
      .notEmpty()
      .withMessage("Description is empty")
      .isString()
      .withMessage("Description must be a string"),
    body("quantity")
      .exists()
      .withMessage("Quantity is missing")
      .notEmpty()
      .withMessage("Quantity is empty")
      .isNumeric()
      .withMessage("Quantity name must be a number"),
    body("image_url")
      .exists()
      .withMessage("Image URL is missing")
      .notEmpty()
      .withMessage("Image URL is empty")
      .isString()
      .withMessage("Image URL must be a string"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: "invalid payload", ...errors });
    } else {
      next();
    }
  },
];

module.exports = itemValidator;