const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class CartItems extends Model {
    static associate() {
      //define associations here
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  CartItems.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      cart_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      item_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "CartItems",
      tableName: "cart_items",
    }
  );
  return CartItems;
};
