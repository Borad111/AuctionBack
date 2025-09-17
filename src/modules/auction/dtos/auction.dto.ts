    import { AuctionImageDTO, AuctionResponseDTO } from "../auction.types";

    // dtos/auction.dto.ts
    export class AuctionDTO {
    static toResponse(auction: any): AuctionResponseDTO {
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
        images: auction.images ? auction.images.map(AuctionDTO.toImageResponse) : [],
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

    static toResponseList(auctions: any[] | null | undefined): AuctionResponseDTO[] {
        if (!auctions || !Array.isArray(auctions)) {
        return [];
        }
        return auctions.map(auction => AuctionDTO.toResponse(auction));
    }
    }