import "dotenv/config";
import { web } from "./application/web";
import { logger } from "./application/logging";

const port = process.env.PORT || 3000;

web.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
