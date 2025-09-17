// src/config/cacheKeys.ts

export const CacheKeys = {
  AUCTIONS_ALL: "auctions:all",
  CATEGORIES_ALL: "categories:all",
  USER_PROFILE: (userId: string) => `user:profile:${userId}`,
  AUCTION_BY_ID: (id: number) => `auction:${id}`,
};
