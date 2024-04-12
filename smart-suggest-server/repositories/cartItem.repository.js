const { CartItems } = require("../models");
module.exports.create = async (cartItemsDetails) => {
  try {
    const cartItems = await CartItems.create(cartItemsDetails);
    return cartItems;
  } catch (error) {
    throw error;
  }
};

module.exports.getAllCartItemsByCartId = async (id) => {
  try {
    const cartItems = await CartItems.findAll({
      where: { cart_uuid: id },
    });
    return cartItems;
  } catch (error) {
    throw error;
  }
};

module.exports.deleteAllCartItemsByCartId = async (id) => {
  try {
    const result = await CartItems.destroy({
      where: { cart_uuid: id },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
