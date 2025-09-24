// src/config/cacheKeys.ts

export const CacheKeys = {
  AUCTIONS_ALL: "auction:all",
  CATEGORIES_ALL: "category:all",
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  AUCTION_BY_ID: (id: string) => `auction:${id}`,
};
