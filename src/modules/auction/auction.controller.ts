import { Request, Response, NextFunction } from "express";
import { AuctionService } from "./auction.service";
import { UtilsService } from "../../utils/utils.service";
import { AuctionDTO } from "./dtos/auction.dto";
import { CategoryDTO } from "./dtos/category.dto";

export class AuctionController {
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
          auctions: AuctionDTO.toResponseList(auctions),
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
}
