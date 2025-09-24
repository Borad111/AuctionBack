import request from "supertest";
import app from "../../../../app";
import { AuctionService } from "../../services/auction.service";

// Mock AuctionService
jest.mock("../../auction.service");

describe("GET /api/v1/auction/allAuctions (Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should return 200 and list of auctions", async () => {
  const mockAuctions = [{ id: 1, title: "Test Auction", images: [] }];


    (AuctionService.getAllAuctions as jest.Mock).mockResolvedValue(mockAuctions);

    const res = await request(app).get("/api/v1/auction/allAuctions");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Get All Auctions Sucessfully");
    expect(res.body.auctions).toEqual(mockAuctions);
  });

  it("❌ should return 500 if service throws error", async () => {
    (AuctionService.getAllAuctions as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const res = await request(app).get("/api/v1/auction/allAuctions");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("DB error");
  });
});
