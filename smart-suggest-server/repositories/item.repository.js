const { Items } = require("../models");
module.exports.create = async (itemDetails) => {
  try {
    const item = await Items.create(itemDetails);
    return item;
  } catch (error) {
    throw error;
  }
};

module.exports.getAllItems = async () => {
  try {
    const items = await Items.findAll();
    return items;
  } catch (error) {
    throw error;
  }
};


module.exports.getItemById = async (id) => {
  try {
    const item = await Items.findOne({
      where: { uuid: id },
    });
    return item;
  } catch (error) {
    throw error;
  }
};

module.exports.getItemByName = async (name) => {
  try {
    const item = await Items.findOne({
      where: { name },
    });
    return item;
  } catch (error) {
    throw error;
  }
};


module.exports.deleteItemById = async (id) => {
  try {
    const result = await Items.destroy({
      where: { uuid: id },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.updateItemById = async (id, itemDetails) => {
  try {
    const result = await Items.update(itemDetails, {
      where: { uuid: id },
    });
    return result;
  } catch (error) {
    throw error;
  }
};