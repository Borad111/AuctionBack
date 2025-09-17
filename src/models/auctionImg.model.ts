import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface AuctionImageAttributes {
  id: string;
  auctionId: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type AuctionImageCreationAttributes = Optional<
  AuctionImageAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class AuctionImage
  extends Model<AuctionImageAttributes, AuctionImageCreationAttributes>
  implements AuctionImageAttributes
{
  public id!: string;
  public auctionId!: string;
  public imageUrl!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuctionImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    auctionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "auction_items", key: "id" },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "auction_images",
    modelName: "AuctionImage",
    timestamps: true,
  }
);

// Associations

