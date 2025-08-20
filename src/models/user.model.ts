import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Role, USER_ROLES } from "../constants/roles";

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role:Role;
  emailVerifiedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreation = Optional<
  UserAttributes,
  "id" | "emailVerifiedAt" | "createdAt" | "updatedAt"
>;

export class User
  extends Model<UserAttributes, UserCreation>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: "ADMIN" | "SELLER" | "BIDDER";
  public emailVerifiedAt?: Date | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

User.init(
  {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(...USER_ROLES),
      defaultValue: "BIDDER",
    },

    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: true,
  }
);