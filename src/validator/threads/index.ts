import { ThreadPayloadSchema } from "./schema";
// exceptions
import InvariantError from "../../exceptions/InvariantError";
// interface
import { ThreadInterface } from "../../interface/threadInterface";

const ThreadsValidator = {
  validateThreadPayload: (payload: ThreadInterface) => {
    const validationResult = ThreadPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

export default ThreadsValidator;
