import { AuctionItem } from "../../../../models/auctionItem.model";
import { RedisService } from "../../../../utils/redis.service";
import { AuctionService } from "../../services/auction.service";

// Mocks
jest.mock("../../../../utils/redis.service");
jest.mock("../../../../models/auctionItem.model");

describe("AuctionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllAuctions", () => {
    it("should return data from cache when available", async () => {
      // 1. Mock Redis success response
      const mockAuctions = [{ id: 1, title: "Cached Auction" }];
      (RedisService.get as jest.Mock).mockResolvedValue(mockAuctions);

      // 2. Call the method
      const result = await AuctionService.getAllAuctions();

      // 3. Verify
      expect(result).toEqual(mockAuctions);
      expect(RedisService.get).toHaveBeenCalledWith("auctions:all");
      expect(AuctionItem.findAll).not.toHaveBeenCalled(); // DB call nahi hua
    });

    it("should fetch from database when cache is empty", async () => {
      // 1. Mock cache miss
      (RedisService.get as jest.Mock).mockResolvedValue(null);

      // 2. Mock database response
      const mockAuctions = [{ id: 1, title: "DB Auction" }];
      (AuctionItem.findAll as jest.Mock).mockResolvedValue(mockAuctions);

      // 3. Call the method
      const result = await AuctionService.getAllAuctions();

      // 4. Verify
      expect(result).toEqual(mockAuctions);
      expect(RedisService.set).toHaveBeenCalled(); // Cache mein save kiya
      expect(AuctionItem.findAll).toHaveBeenCalled(); // DB call hua
    });

    it("should throw error when database query fails", async () => {
      // 1. Mock cache miss
      (RedisService.get as jest.Mock).mockResolvedValue(null);

      // 2. Mock database error
      const dbError = new Error("Database connection failed");
      (AuctionItem.findAll as jest.Mock).mockRejectedValue(dbError);

      // 3. Verify that error is thrown
      await expect(AuctionService.getAllAuctions()).rejects.toThrow(
        "Failed to fetch auctions"
      );
    });

    it("should return empty array when no auctions exist", async () => {
      // 1. Mock cache miss
      (RedisService.get as jest.Mock).mockResolvedValue(null);

      // 2. Mock empty database response
      (AuctionItem.findAll as jest.Mock).mockResolvedValue([]);

      // 3. Call the method
      const result = await AuctionService.getAllAuctions();

      // 4. Verify
      expect(result).toEqual([]);
      expect(RedisService.set).toHaveBeenCalledWith("auctions:all", [], 3600);
    });

    it("should fallback to database when Redis fails", async () => {
      (RedisService.get as jest.Mock).mockRejectedValue(
        new Error("Redis down")
      );

      // 2. Mock database response
      const mockAuctions = [{ id: 1, title: "Fallback Auction" }];
      (AuctionItem.findAll as jest.Mock).mockResolvedValue(mockAuctions);

      // 3. Call the method
      const result = await AuctionService.getAllAuctions();

      // 4. Verify fallback worked
      expect(result).toEqual(mockAuctions);
      expect(AuctionItem.findAll).toHaveBeenCalled(); // DB call hua
    });
  });
});
