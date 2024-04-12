const { Carts } = require("../models");
module.exports.create = async (cartsDetails) => {
  try {
    const carts = await Carts.create(cartsDetails);
    return carts;
  } catch (error) {
    throw error;
  }
};

module.exports.getCartById = async (id) => {
  try {
    const cart = await Carts.findOne({
      where: { uuid: id },
    });
    return cart;
  } catch (error) {
    throw error;
  }
};

module.exports.getCartByUserId = async (id) => {
  try {
    const cart = await Carts.findOne({
      where: { user_uuid: id },
    });
    return cart;
  } catch (error) {
    throw error;
  }
};

module.exports.deleteCartById = async (id) => {
  try {
    const result = await Carts.destroy({
      where: { uuid: id },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
