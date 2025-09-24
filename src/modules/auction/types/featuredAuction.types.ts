// dtos/auction.dto.ts
export interface FeaturedAuctionResponseDTO {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  status: "ACTIVE" | "ENDED" | "CANCELLED";
  startTime: Date;
  endTime: Date;
  sellerId: string;
  categoryId?: string | null;
  createdAt: Date;
  images: AuctionImageDTO[]; 
  category?: AuctionCategoryDTO | null; // ✅ Images ke liye alag DTO
}

export interface AuctionImageDTO {
  id: string;
  imageUrl: string;
  createdAt: Date;
}
export interface AuctionCategoryDTO {
  id: string;
  name: string;
  icon?: string | null;
}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  icon: string | null;
  auctionCount: number; // har category me auction count
}

// types/auction.types.ts
export interface AuctionResponseDTO {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  reservePrice: number;
  currentBid: number;
  status: string;
  startTime: Date;
  endTime: Date;
  seller: { id: string; name: string; email: string } | null;
  category: { id: string; name: string } | null;
  images: { id: string; url: string }[];
  bids: { id: string; amount: number; bidder: { id: string; name: string } }[];
}
