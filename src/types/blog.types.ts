export type BlogsTypes = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type OutputType<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
};

export type BlogViewType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type PostPutViewModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
