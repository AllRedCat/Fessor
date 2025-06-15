import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

const url = "mysql://admin:password@localhost/fessor"

const db = drizzle(url, { mode: "default", schema });

export default db