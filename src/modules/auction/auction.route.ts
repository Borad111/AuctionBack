import {Router} from "express";
import { AuctionController } from "./controllers/auction.controller";
const router=Router();

router.get('/auctions',AuctionController.getAllAuctions);
router.post("/auctions/cache", AuctionController.clearAuctionCache);
router.get('/categories',AuctionController.getAllCategories); 
router.post("/categories/cache", AuctionController.clearCategoriesCache);
router.get("/auction/:id", AuctionController.getAuctionDetails);


export default router;