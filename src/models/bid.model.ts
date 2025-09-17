// models/Bid.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";


interface BidAttributes {
  id: string;
  amount: number;
  userId: string;
  auctionItemId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type BidCreationAttributes = Optional<BidAttributes, "id" | "createdAt" | "updatedAt">;

export class Bid
  extends Model<BidAttributes, BidCreationAttributes>
  implements BidAttributes
{
  public id!: string;
  public amount!: number;
  public userId!: string;
  public auctionItemId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Bid.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auctionItemId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "bids",
    modelName: "Bid",
    timestamps: true,
  }
);


