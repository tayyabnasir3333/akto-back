import { Request, Response, NextFunction } from "express";
import searchLimitService from "../services/searchLimitService";

class SearchLimitroller {
  async getFreeSearches(req: Request, res: Response, next: NextFunction) {
    try {
      const freeSearches = await searchLimitService.getFreeSearches();
      return res.status(freeSearches.statusCode).send(freeSearches);
    } catch (error) {
      return next(error);
    }
  }
  async updateSearchLimit(req: Request, res: Response, next: NextFunction) {
    try {
      const { freeSearches, id, guestSearch } = req.body;
      const searches = await searchLimitService.updateSearchLimit(
        freeSearches,
        id,
        guestSearch,
      );
      return res.status(searches!.statusCode).send({ msg: searches!.msg });
    } catch (error) {
      return next(error);
    }
  }
}

export default new SearchLimitroller();
