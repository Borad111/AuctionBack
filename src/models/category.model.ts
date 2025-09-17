// models/Category.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CategoryAttributes {
  id: string;
  name: string;
   icon?: string | null;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, "id" >;

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
   public icon?: string | null;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

     icon: {
      type: DataTypes.STRING(50),
      allowNull: true, 
    },
  },
  {
    sequelize,
    tableName: "categories",
    modelName: "Category",
    timestamps: false,
  }
);
