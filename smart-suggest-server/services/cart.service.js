// Import the cartrepository, cartItemRepository, itemRepository to manage operations related to the shopping cart.
const cartRepository = require("../repositories/cart.repository");
const cartItemRepository = require("../repositories/cartItem.repository");
const itemRepository = require("../repositories/item.repository");
const axios = require("axios");


module.exports.addToCart = async (userId, cartDetails) => {
  try {
    // Attempt to retrieve the cart associated with the given userId. If no cart exists, create a new one.
    var cart = await cartRepository.getCartByUserId(userId);
    if (!cart) cart = await cartRepository.create({ user_uuid: userId });
    cartItemRepository.deleteAllCartItemsByCartId(cart.uuid);
    // Loop through each item in cartDetails and create new cart item entries in the database.
    cartDetails.cartItems.forEach((item) =>
      cartItemRepository.create({ ...item, cart_uuid: cart.uuid })
    );
    return {cart};
    // return {cart,recommendedItems};
  } catch (error) {
    throw error;
  }
};

module.exports.checkout = async (userId) => {
  try {
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) throw new Error("No cart associated with user " + userId);
    // Attempt to retrieve the user's cart using their userID.
    const items = await cartItemRepository.getAllCartItemsByCartId(cart.uuid);
    this.verifyStockAvailability(items);
    for (const item of items) {
      var itemToUpdate = await itemRepository.getItemById(item.item_uuid);
      if (!itemToUpdate)
        throw new Error("Item with id " + item.item_uuid + " not found");
      var updatedQuantity = itemToUpdate.quantity - item.quantity;
      var updatingItem = {
        ...itemToUpdate.dataValues,
        quantity: updatedQuantity,
      };
      itemToUpdate.quantity = updatedQuantity;
      await itemRepository.updateItemById(item.item_uuid, updatingItem);
    }
    await this.deleteCartByUserId(userId);
    return { cartDetails: cart, cartItems: items };
  } catch (error) {
    throw error;
  }
};

module.exports.getCartByUserId = async (id) => {
  try {
    const cart = await cartRepository.getCartByUserId(id);
    if (!cart) throw new Error("No cart associated with user");
    const items = await cartItemRepository.getAllCartItemsByCartId(cart.uuid);
    var responseData = [];
    if(items.length >0) {
      for(var item of items) {
        //// Collect detailed data for each item if the cart is not empty.
        var itemData = await itemRepository.getItemById(item.item_uuid);
        responseData.push({...item.dataValues, item: {...itemData.dataValues}});
      }
    }
    // Generate names of items in the cart to use for making recommendation requests.
    var recommendationPayloadPromises = items.map(async item => {
      const data = await itemRepository.getItemById(item.item_uuid);
      return data.name;
    });

    const recommendationPayload = await Promise.all(recommendationPayloadPromises);
    const response = await axios.post("http://localhost:8000/predict", {items: recommendationPayload});
    // Retrieve and prepare recommended items based on the API's response.
    //since, we need item in all details, the function stores in fetchitem
    var recommendedItems = [];
    for(var data of response.data) {
      const fetchedItem = await itemRepository.getItemByName(data);
      if(fetchedItem)      recommendedItems.push(fetchedItem);
    }
        // Return the detailed cart, the items in the cart, and the recommended items.
    return { cartDetails: cart, cartItems: responseData, recommendedItems };
  } catch (error) {
    throw error;
  }
};

module.exports.deleteCartByUserId = async (id) => {
  try {
    // Retrieve the cart associated with the given user ID.
    const cart = await cartRepository.getCartByUserId(id);
    if (!cart) {
      throw new Error("No cart found associated with user " + id);
    }
    // Delete all cart items associated with the found cart.
    await cartItemRepository.deleteAllCartItemsByCartId(cart.uuid);
    await cartRepository.deleteCartById(cart.uuid);
  } catch (error) {
    throw error;
  }
};

module.exports.verifyStockAvailability = async (items) => {
  try {
    // Iterate over each item to check stock levels.
    for (const item of items) {
      var item_uuid = item.item_uuid;
      var toValidateItem = await itemRepository.getItemById(item_uuid);
      if (!toValidateItem) {
        throw new Error(
          "The item with id " + item_uuid + " is not available in the shop"
        );
      }
      if (item.quantity > toValidateItem.quantity) {
        throw new Error(
          "Item with id " +
            item_uuid +
            " is not available in requested quantity"
        );
      }
    }
  } catch (error) {
    throw error;
  }
};
