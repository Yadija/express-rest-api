// utils
import tokens from "../utils/authentications.js";
// exceptions
import InvariantError from "../exceptions/InvariantError.js";

const addRefreshToken = (refreshToken) => {
  tokens.push(refreshToken);
};

const verifyRefreshToken = (refreshToken) => {
  const token = tokens.find((token) => token === refreshToken);

  if (!token) {
    throw new InvariantError("refresh token not found");
  }
};

const deleteRefreshToken = (refreshToken) => {
  const index = tokens.findIndex((token) => token === refreshToken);
  tokens.splice(index, 1);
};

export default { addRefreshToken, verifyRefreshToken, deleteRefreshToken };
