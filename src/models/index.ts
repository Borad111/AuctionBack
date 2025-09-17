import sequelize from "../config/database";
import { User } from "./user.model";
import { AuctionItem } from "./auctionItem.model";
import { Bid } from "./bid.model";
import { Category } from "./category.model";
import { Transaction } from "./transaction.model";
import { Watchlist } from "./watchlist.model";
import { AuctionImage } from "./auctionImg.model";

const db = {
  sequelize,
  User,
  AuctionItem,
  Bid,
  Category,
  Transaction,
  Watchlist,
  AuctionImage
};

export default db;
