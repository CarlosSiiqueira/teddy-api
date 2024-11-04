export interface IUrlResponse {
  id: string;
  origin_url: string;
  tidy_url: string;
  updated_at: Date;
  User: {
    username: string;
  }
  UrlAccess: {
    User: {
      username: string;
    };
    last_access: Date;
  }[]
}