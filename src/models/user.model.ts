import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Role, USER_ROLES } from "../constants/roles";
import bcrypt from "bcryptjs";

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
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
  public passwordHash!: string;
  public role!: Role;
  public emailVerifiedAt?: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

    public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
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
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
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
    // Remove the hooks since we're handling hashing in the service
  }
);
