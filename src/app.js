import "dotenv/config";
import { web } from "./application/web.js";

const port = process.env.PORT || 3000;

web.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
