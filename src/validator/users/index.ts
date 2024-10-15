import { UserPayloadSchema } from "./schema";
// exceptions
import InvariantError from "../../exceptions/InvariantError";
// interface
import { AddUserInterface } from "../../interface/userInterface";

const UsersValidator = {
  validateUserPayload: (payload: AddUserInterface) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

export default UsersValidator;
