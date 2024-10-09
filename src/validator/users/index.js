import { UserPayloadSchema } from "./schema.js";
// exceptions
import InvariantError from "../../exceptions/InvariantError.js";

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

export default UsersValidator;
