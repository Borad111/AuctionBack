    // models/Transaction.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface TransactionAttributes {
  id: string;
  auctionItemId: string;
  buyerId: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt?: Date;
}

type TransactionCreationAttributes = Optional<TransactionAttributes, "id" | "createdAt">;

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string;
  public auctionItemId!: string;
  public buyerId!: string;
  public amount!: number;
  public status!: "PENDING" | "SUCCESS" | "FAILED";
  public readonly createdAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    auctionItemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    buyerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    tableName: "transactions",
    modelName: "Transaction",
    timestamps: true,
  }
);


