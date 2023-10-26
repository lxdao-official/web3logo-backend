export interface PageSize {
  page: number;
  size: number;
}

export type FindLogos = PageSize & { logoNameId: number };

export type FindLogoNameQuery = PageSize & { key?: string; logoType?: string };
