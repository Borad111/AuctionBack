import { Request, Response, NextFunction } from "express";
import { AuctionService } from "../services/auction.service";
import { UtilsService } from "../../../utils/utils.service";
import { FeaturedAuctionDTO } from "../dtos/featuredAuction.dto";
import { CategoryDTO } from "../dtos/category.dto";
import { AuctionItem } from "../../../models/auctionItem.model";
import { User } from "../../../models/user.model";
import { Category } from "../../../models/category.model";
import { AuctionImage } from "../../../models/auctionImg.model";
import { Bid } from "../../../models/bid.model";
import { AuctionDTO } from "../dtos/auction.dto";
import { AuctionParams, AuctionResponseDTO } from "../types/auction.types";
import { ApiResponse } from "../../../types/api.types";

export class AuctionController {
  // to be implemented            
  
  static async getAllAuctions(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const auctions = await AuctionService.getAllAuctions();
      UtilsService.sendSuccess(
        res,
        {
          message: "Get All Auctions Sucessfully",
          auctions: FeaturedAuctionDTO.toResponseList(auctions),
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
  static async clearAuctionCache(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await AuctionService.clearAuctionCache();
      UtilsService.sendSuccess(
        res,
        { message: "Auction cache cleared successfully" },
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAllCategories(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await AuctionService.getCategoriesWithCount();
      UtilsService.sendSuccess(
        res,
        {
          message: "Categories fetched successfully",
          categories: CategoryDTO.toResponseList(categories),
        },
        200
      );
    } catch (err) {
      next(err);
    }
  }

  static async clearCategoriesCache(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await AuctionService.clearAuctionCache();
      UtilsService.sendSuccess(
        res,
        { message: "Categories  cache cleared successfully" },
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAuctionDetails(req: Request<AuctionParams>, res: Response<ApiResponse<AuctionResponseDTO>>, next: NextFunction) {
    try {
      const auction = await AuctionService.getAuctionDetails(req.params.id);

      UtilsService.sendSuccess(
        res,
        {
          message: "Auction details fetched successfully",
          auction: AuctionDTO.toResponse(auction),
        },
        200
      );
    } catch (err) {
      next(err);
    }
  }

}
