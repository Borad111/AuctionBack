import db from "./index";

const { User, AuctionItem, Bid, Category, Transaction, Watchlist , AuctionImage } = db;

// 🔹 User → Auction Items
User.hasMany(AuctionItem, { foreignKey: "sellerId", as: "items" });
AuctionItem.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

// 🔹 Auction Item → Bids
AuctionItem.hasMany(Bid, { foreignKey: "auctionItemId", as: "bids" });
Bid.belongsTo(AuctionItem, { foreignKey: "auctionItemId", as: "auctionItem" });

// 🔹 User → Bids
User.hasMany(Bid, { foreignKey: "userId", as: "bids" });
Bid.belongsTo(User, { foreignKey: "userId", as: "bidder" });

// 🔹 Auction Item → Category
Category.hasMany(AuctionItem, { foreignKey: "categoryId", as: "items" });
AuctionItem.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// 🔹 Auction Item → Transaction
AuctionItem.hasOne(Transaction, { foreignKey: "auctionItemId", as: "transaction" });
Transaction.belongsTo(AuctionItem, { foreignKey: "auctionItemId", as: "auctionItem" });

// 🔹 User → Transaction
User.hasMany(Transaction, { foreignKey: "buyerId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });

// 🔹 User → Watchlist
User.hasMany(Watchlist, { foreignKey: "userId", as: "watchlist" });
Watchlist.belongsTo(User, { foreignKey: "userId", as: "user" });

// 🔹 Auction Item → Watchlist
AuctionItem.hasMany(Watchlist, { foreignKey: "auctionItemId", as: "watchlistedBy" });
Watchlist.belongsTo(AuctionItem, { foreignKey: "auctionItemId", as: "auctionItem" });

// 🔹 Auction Item → Auction Img
AuctionItem.hasMany(AuctionImage, { foreignKey: "auctionId", as: "images" });
AuctionImage.belongsTo(AuctionItem, { foreignKey: "auctionId", as: "auction" });    

export default db;
    