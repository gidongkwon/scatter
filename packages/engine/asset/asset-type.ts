export const assetTypes = ["texture"] as const;
export type AssetType = (typeof assetTypes)[number];
