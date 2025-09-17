import {Router} from "express";
import { AuctionController } from "./auction.controller";
const router=Router();

router.get('/auctions',AuctionController.getAllAuctions);
router.post("/auctions/cache", AuctionController.clearAuctionCache);
router.get('/categories',AuctionController.getAllCategories); 
router.post("/categories/cache", AuctionController.clearCategoriesCache);

export default router;