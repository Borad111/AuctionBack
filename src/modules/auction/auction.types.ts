// dtos/auction.dto.ts
export interface AuctionResponseDTO {
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
