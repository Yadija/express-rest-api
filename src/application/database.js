import pkg from "pg";
import { config } from "./config";

const { Pool } = pkg;
const pool = new Pool(config.database);

export default pool;
