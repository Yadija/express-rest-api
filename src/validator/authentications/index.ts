import {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} from "./schema";
// interface
import {
  PostAuthenticationInterface,
  RefreshTokenInterface,
} from "../../interface/authenticationInterface";
// exceptions
import InvariantError from "../../exceptions/InvariantError";

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload: PostAuthenticationInterface) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },

  validatePutAuthenticationPayload: (payload: RefreshTokenInterface) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },

  validateDeleteAuthenticationPayload: (payload: RefreshTokenInterface) => {
    const validationResult =
      DeleteAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

export default AuthenticationsValidator;
