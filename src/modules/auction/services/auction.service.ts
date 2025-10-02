import { UtilsService } from "../../../utils/utils.service";
import { AuctionItem } from "../../../models/auctionItem.model";
import { AuctionImage } from "../../../models/auctionImg.model";
import logger from "../../../utils/logger";
import { RedisService } from "../../../utils/redis.service";
import { CacheKeys } from "../../../config/cacheKeys";
import { CacheTTL } from "../../../config/cacheTTL";
import { Category } from "../../../models/category.model";
import sequelize from "../../../config/database";
import { User } from "../../../models/user.model";
import { Bid } from "../../../models/bid.model";
import { AuctionWithBids } from "../types/auction.types";
export class AuctionService {
  static async clearAuctionCache(): Promise<void> {
    try {
      await RedisService.clearPattern("auction:*"); // sirf auctions:all clear hoga
      logger.info("✅ Auction cache cleared successfully.");
    } catch (error) {
      logger.error("❌ Failed to clear auction cache:", error);
    }
  }
    static async clearCategoriesCache(): Promise<void> {
    try {
      await RedisService.clearPattern("categories:*"); // sirf auctions:all clear hoga
      logger.info("✅ Categories cache cleared successfully.");
    } catch (error) {
      logger.error("❌ Failed to clear Categories cache:", error);
    }
  }
  static async getAllAuctions(): Promise<AuctionItem[]> {
    const cacheKey = CacheKeys.AUCTIONS_ALL;
    let cachedData: AuctionItem[] | null = null;

    try {
      cachedData = await RedisService.get<AuctionItem[]>(cacheKey);
    } catch (error) {
      logger.warn("⚠️ Redis unavailable, falling back to DB:", error);
    }

    if (cachedData) {
      logger.info("✅ Serving from cache");
      return cachedData;
    }

    // ✅ Agar cache miss ya Redis down to DB call karo
    const [err, auctions] = await UtilsService.to(
      AuctionItem.findAll({
        include: [
          { model: AuctionImage, as: "images" },
          { model: Category, as: "category" }, // ✅ Add this line
        ],
        order: [["createdAt", "DESC"]],
      })
    );

    if (err) {
      logger.error("GetAllAuctions DB error:", err);
      UtilsService.throwError(`Failed to fetch auctions ${err} `, 500);
    }

    const result = auctions ?? [];

    try {
      await RedisService.set(cacheKey, result, CacheTTL.ONE_HOUR);
    } catch (error) {
      logger.warn("⚠️ Redis set failed:", error);
    }

    return result;
  }
  static async getCategoriesWithCount(): Promise<Category[] | null> {
    {
      const cacheKey = CacheKeys.CATEGORIES_ALL;
      let cachedData = null;

      try {
        cachedData = await RedisService.get<Category[]>(cacheKey);
      } catch (err) {
        logger.warn("Redis unavailable", err);
      }

      // if (cachedData) return cachedData;

      const [err, categories] = await UtilsService.to(
        Category.findAll({
          include: [
            {
              model: AuctionItem,
              as: "items",
              attributes: [], // sirf count chahiye
            },
          ],
          attributes: {
            include: [
              [
                // count of auctions per category
                sequelize.fn("COUNT", sequelize.col("items.id")),
                "auctionCount",
              ],
            ],
          },
          group: ["Category.id"],
            having: sequelize.literal("COUNT(items.id) > 0"),
        })
      );

      if (err)
        UtilsService.throwError(`Failed to fetch categories ${err}`, 500);

      try {
        await RedisService.set(cacheKey, categories, CacheTTL.ONE_HOUR); // 1 hour TTL
      } catch (error) {
        logger.warn("⚠️ Redis set failed:", error);
      }
      return categories;
    }
  }
  static async getAuctionDetails(id: string) {
    const cacheKey = CacheKeys.AUCTION_BY_ID(id);
    try {
      const cached = await RedisService.get(cacheKey);
      if (cached) return cached;
    } catch (err) {
      logger.warn("⚠️ Redis unavailable:", err);
    }

    const [err, auction ] = await UtilsService.to(
      AuctionItem.findOne({
        where: { id },
        include: [
          { model: User, as: "seller", attributes: ["id", "name", "email"] },
          { model: Category, as: "category", attributes: ["id", "name"] },
          { model: AuctionImage, as: "images", attributes: ["id", "imageUrl"] },
          {
            model: Bid,
            as: "bids",
            include: [{ model: User, as: "bidder", attributes: ["id", "name"] }],
          },
        ],
      }) as Promise<AuctionWithBids | null>
    );

    if (!auction) UtilsService.throwError("Auction not found", 404);
    if (err) UtilsService.throwError("Failed to fetch auction details", 500);

    // ✅ calculate current bid
      const currentBid =
        auction.bids.length > 0
          ? Math.max(...auction.bids.map((b) => b.amount))
          : auction.startingPrice;

    const result = { ...auction.toJSON(), currentBid };

    try {
      await RedisService.set(cacheKey, result, CacheTTL.ONE_HOUR);
    } catch (error) {
      logger.warn("⚠️ Redis set failed:", error);
    }

    return result;
  }
}
