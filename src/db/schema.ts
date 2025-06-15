import { relations } from 'drizzle-orm';
import { bigint, boolean, decimal, double, float, int, json, longtext, mysqlEnum, mysqlTable, serial, time, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const demo = mysqlTable('demo', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: longtext('description').notNull(),
});