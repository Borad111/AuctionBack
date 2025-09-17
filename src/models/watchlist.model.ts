// models/Watchlist.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";


interface WatchlistAttributes {
  id: string;
  userId: string;
  auctionItemId: string;
}

type WatchlistCreationAttributes = Optional<WatchlistAttributes, "id">;

export class Watchlist
  extends Model<WatchlistAttributes, WatchlistCreationAttributes>
  implements WatchlistAttributes
{
  public id!: string;
  public userId!: string;
  public auctionItemId!: string;
}

Watchlist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    tableName: "watchlists",
    modelName: "Watchlist",
    timestamps: true,
  }
);


