import { SearchLimit } from "../models/SearchLimit";

class SearchLimitService {
  async getFreeSearches() {
    const freeSearches = await SearchLimit.find();
    return {
      statusCode: 200,
      data: freeSearches,
      msg: "data fetched",
    };
  }
  async updateSearchLimit(
    freeSearches: number,
    id: string,
    guestSearch: number,
  ) {
    try {
      if (id) {
        const updatedSearchLimit = await SearchLimit.findByIdAndUpdate(
          id,
          {
            freeSearches,
            guestSearch,
          },
          { new: true },
        );

        if (updatedSearchLimit) {
          return {
            statusCode: 201,
            msg: `Search limit is updated to ${freeSearches} and Guest Search is with ${guestSearch}`,
          };
        } else {
          return {
            statusCode: 404,
            msg: "Search limit not found with the provided ID",
          };
        }
      } else {
        const existingSearchLimit = await SearchLimit.findOne();

        if (existingSearchLimit) {
          return {
            statusCode: 400,
            msg: "Search limit already exists. Use the provided ID to update.",
          };
        } else {
          await SearchLimit.create({ freeSearches, guestSearch });
          return {
            statusCode: 201,
            msg: `Search limit is created with value ${freeSearches} and Guest Search is with ${guestSearch}`,
          };
        }
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        msg: "Internal Server Error",
      };
    }
  }
}

export default new SearchLimitService();
