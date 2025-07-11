import { DataTypes, DATE } from "sequelize";
import sequelize from "../config/database";
import slugify from "slugify";

const Tour = sequelize.define(
  "Tour",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
    },
    images: {
      type: DataTypes.TEXT("long"),
    },
    price: {
      type: DataTypes.INTEGER,
    },
    discount: {
      type: DataTypes.INTEGER,
    },
    information: {
      type: DataTypes.TEXT("long"),
    },
    schedule: {
      type: DataTypes.TEXT("long"),
    },
    timeStart: {
      type: DataTypes.DATE,
    },
    stock: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING(20),
    },
    position: {
      type: DataTypes.INTEGER,
    },
    slug: {
      type: DataTypes.STRING(255),
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "tours",
    timestamps: true,
  }
);

Tour.beforeCreate((tour) => {
  tour["slug"] = slugify(`${tour["title"]}-${Date.now()}`, {
    lower: true,
    strict: true,
  });
});

export default Tour;
