// dto/auction.dto.ts

import { AuctionResponseDTO } from "../types/featuredAuction.types";

export class AuctionDTO {
  static toResponse(auction: any): AuctionResponseDTO {
    return {
      id: auction.id,
      title: auction.title,
      description: auction.description,
      startingPrice: auction.startingPrice,
      reservePrice: auction.reservePrice,
      currentBid: auction.currentBid,
      status: auction.status,
      startTime: auction.startTime,
      endTime: auction.endTime,
      seller: auction.seller
        ? { id: auction.seller.id, name: auction.seller.name, email: auction.seller.email }
        : null,
      category: auction.category
        ? { id: auction.category.id, name: auction.category.name }
        : null,
      images: auction.images?.map((img: any) => ({ id: img.id, url: img.imageUrl })) || [],
      bids:
        auction.bids?.map((bid: any) => ({
          id: bid.id,
          amount: bid.amount,
          bidder: { id: bid.bidder.id, name: bid.bidder.name },
        })) || [],
    };
  }
}
