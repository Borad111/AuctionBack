    import { AuctionImageDTO, FeaturedAuctionResponseDTO } from "../types/featuredAuction.types";

    // dtos/auction.dto.ts
    export class FeaturedAuctionDTO {
    static toResponse(auction: any): FeaturedAuctionResponseDTO {
        return {
        id: auction.id,
        title: auction.title,
        description: auction.description,
        startingPrice: auction.startingPrice,
        currentPrice: auction.currentPrice,
        status: auction.status,
        startTime: auction.startTime,
        endTime: auction.endTime,
        sellerId: auction.sellerId,
        categoryId: auction.categoryId,
        createdAt: auction.createdAt,
        images: auction.images ? auction.images.map(FeaturedAuctionDTO.toImageResponse) : [],
           category: auction.category
        ? {
            id: auction.category.id,
            name: auction.category.name,
            icon: auction.category.icon,
          }
        : null,
        };
    }

    static toImageResponse(image: any): AuctionImageDTO {
        return {
        id: image.id,
        imageUrl: image.imageUrl,
        createdAt: image.createdAt
        };
    }

    static toResponseList(auctions: any[] | null | undefined): FeaturedAuctionResponseDTO[] {
        if (!auctions || !Array.isArray(auctions)) {
        return [];
        }
        return auctions.map(auction => FeaturedAuctionDTO.toResponse(auction));
    }
    }