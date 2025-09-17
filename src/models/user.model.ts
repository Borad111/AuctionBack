import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Role, USER_ROLES } from "../constants/roles";

interface UserAttributes {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: Role;
  emailVerifiedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "emailVerifiedAt" | "createdAt" | "updatedAt" | "role"
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public role!: Role;
  public emailVerifiedAt?: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 🔥 Password related sab kuch HATA DIYA
}

User.init(
  {
    id: {
      type: DataTypes.STRING, // ✅ Firebase UID store karega
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // 🔥 passwordHash field COMPLETELY REMOVE kar diya
    role: {
      type: DataTypes.ENUM(...USER_ROLES),
      defaultValue: "BIDDER", // ✅ Ensure role values match
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