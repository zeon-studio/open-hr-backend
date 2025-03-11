export type AuthenticationType = {
  user_id: string;
  refresh_token: string;
  pass_reset_token?: {
    token?: string;
    expires?: string;
  };
};
