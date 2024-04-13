const cartRepository = require("../repositories/cart.repository");
const cartItemRepository = require("../repositories/cartItem.repository");
const itemRepository = require("../repositories/item.repository");
const axios = require("axios");


module.exports.addToCart = async (userId, cartDetails) => {
  try {
    var cart = await cartRepository.getCartByUserId(userId);
    if (!cart) cart = await cartRepository.create({ user_uuid: userId });
    cartItemRepository.deleteAllCartItemsByCartId(cart.uuid);
    // var recommendationPayloadPromises = cartDetails.cartItems.map(async item => {
    //   const data = await itemRepository.getItemById(item.item_uuid);
    //   return data.name;
    // });

    // const recommendationPayload = await Promise.all(recommendationPayloadPromises);
    // const response = await axios.post("http://3.146.206.90:8000/predict", recommendationPayload);
    // var recommendedItems = [];
    // for(var data of response) {
    //   const fetchedItem = await itemRepository.getItemByName();
    //   if(fetchedItem)      recommendedItems.push(fetchedItem);
    // }

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
        var itemData = await itemRepository.getItemById(item.item_uuid);
        responseData.push({...item.dataValues, item: {...itemData.dataValues}});
      }
    }

    var recommendationPayloadPromises = items.map(async item => {
      const data = await itemRepository.getItemById(item.item_uuid);
      return data.name;
    });

    const recommendationPayload = await Promise.all(recommendationPayloadPromises);
    const response = await axios.post("http://3.146.206.90:8000/predict", {items: recommendationPayload});
    var recommendedItems = [];
    for(var data of response.data) {
      const fetchedItem = await itemRepository.getItemByName(data);
      if(fetchedItem)      recommendedItems.push(fetchedItem);
    }
    return { cartDetails: cart, cartItems: responseData, recommendedItems };
  } catch (error) {
    throw error;
  }
};

module.exports.deleteCartByUserId = async (id) => {
  try {
    const cart = await cartRepository.getCartByUserId(id);
    if (!cart) {
      throw new Error("No cart found associated with user " + id);
    }
    await cartItemRepository.deleteAllCartItemsByCartId(cart.uuid);
    await cartRepository.deleteCartById(cart.uuid);
  } catch (error) {
    throw error;
  }
};

module.exports.verifyStockAvailability = async (items) => {
  try {
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
