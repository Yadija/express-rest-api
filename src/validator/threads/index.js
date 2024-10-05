import InvariantError from "../../exceptions/InvariantError.js";
import { ThreadPayloadSchema } from "./schema.js";

const ThreadsValidator = {
  validateThreadPayload: (payload) => {
    const validationResult = ThreadPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

export default ThreadsValidator;
