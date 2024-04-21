const service = require("../services/cart.service");

exports.addToCart = async (req, res, next) => {
  try {
    await service.verifyStockAvailability(req.body.cartItems);
    const cart = await service.addToCart(req.user.uuid, req.body);
    res.status(201).json({
      message: "Cart created successfully",
      cart: cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const cart = await service.checkout(req.user.uuid);
    res.status(201).json({
      message: "Cart checked out successfully",
      cart: cart,  
    });
  } catch (error) {
    next(error);
  }
};

exports. getCartByUserId = async (req, res, next) => {
  try {
    const cart = await service.getCartByUserId(req.user.uuid);
    res.send(cart);
  } catch (error) {
    next(error);
  }
};

exports.deleteCartByUserId = async (req, res, next) => {
  try {
    await service.deleteCartByUserId(req.user.uuid);
    res.send("Cart deleted successfully");
  } catch (error) {
    next(error);
  }
};
