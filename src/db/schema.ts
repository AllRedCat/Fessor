import { relations } from 'drizzle-orm';
import { bigint, boolean, decimal, double, float, int, json, longtext, mysqlEnum, mysqlTable, serial, time, timestamp, varchar } from 'drizzle-orm/mysql-core';

// Base demo
export const demo = mysqlTable('demo', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: longtext('description').notNull(),
});

// Tabelas
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  document: varchar('document', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin', 'user', 'demo']).default('demo'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  profilePicture: varchar('profile_picture', { length: 255 }),
  schoolId: int('school_id').notNull().references(() => schools.id),
});

export const schools = mysqlTable('schools', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  principal: varchar('principal', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
});

export const students = mysqlTable('students', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  document: varchar('document', { length: 20 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  schoolId: int('school_id').notNull().references(() => schools.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const reports = mysqlTable('reports', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull().references(() => students.id),
  userId: int('user_id').notNull().references(() => users.id),
  schoolId: int('school_id').notNull().references(() => schools.id),
  content: longtext('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Relações
export const schoolsRelations = relations(schools, ({ many }) => ({
  users: many(users),
  students: many(students),
  reports: many(reports),
}));

export const usersRelations = relations(users, ({ one }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  student: one(students, {
    fields: [reports.studentId],
    references: [students.id],
  }),
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [reports.schoolId],
    references: [schools.id],
  }),
}));