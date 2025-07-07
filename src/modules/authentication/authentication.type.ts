export type AuthenticationType = {
  user_id: string;
  pass_reset_token?: {
    token?: string;
    expires?: string;
  };
};
