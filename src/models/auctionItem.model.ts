// models/AuctionItem.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";


interface AuctionItemAttributes {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  reservePrice?: number | null;
  currentPrice: number;
  status: "ACTIVE" | "ENDED" | "CANCELLED";
  startTime: Date;
  endTime: Date;
  sellerId: string;
  categoryId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type AuctionItemCreationAttributes = Optional<
  AuctionItemAttributes,
  "id" | "reservePrice" | "categoryId" | "createdAt" | "updatedAt" | "currentPrice"
>;

export class AuctionItem
  extends Model<AuctionItemAttributes, AuctionItemCreationAttributes>
  implements AuctionItemAttributes
{
  public id!: string;
  public title!: string;
  public description!: string;
  public startingPrice!: number;
  public reservePrice!: number | null;
  public currentPrice!: number;
  public status!: "ACTIVE" | "ENDED" | "CANCELLED";
  public startTime!: Date;
  public endTime!: Date;
  public sellerId!: string;
  public categoryId?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuctionItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
  
    startingPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reservePrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    currentPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "ENDED", "CANCELLED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "auction_items",
    modelName: "AuctionItem",
    timestamps: true,
    paranoid: true, // ✅ Soft delete
  }
);


