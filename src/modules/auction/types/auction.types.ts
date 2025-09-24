import { AuctionItem } from "../../../models/auctionItem.model";

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

export interface AuctionParams {
  id: string;
}

export interface AuctionWithBids extends AuctionItem {
  bids: { id: string; amount: number }[];
}
