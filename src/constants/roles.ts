export const USER_ROLES = ["ADMIN", "SELLER", "BIDDER"] as const;
export type Role = (typeof USER_ROLES)[number];
