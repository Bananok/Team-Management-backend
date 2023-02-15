interface ITokenResponse {
  accessToken: string;
  expiresIn: string;
  refreshToken: string;
}

export default ({
  accessToken = expect.any(String),
  expiresIn = expect.any(String),
  refreshToken = expect.any(String),
}: {
  accessToken: string;
  expiresIn: string;
  refreshToken: string;
}): ITokenResponse => ({
  accessToken,
  expiresIn,
  refreshToken,
});
