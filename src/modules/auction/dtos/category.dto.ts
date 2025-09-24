import { CategoryResponseDTO } from "../types/featuredAuction.types";

export class CategoryDTO {
  static toResponse(category: any): CategoryResponseDTO {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon ?? null,
      auctionCount: category.dataValues?.auctionCount ?? 0,
    };
  }

  static toResponseList(categories: any[] | null | undefined): CategoryResponseDTO[] {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.map((cat) => CategoryDTO.toResponse(cat));
  }
}
