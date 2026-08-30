import {
  date,
  index,
  integer,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Everything iHelp owns lives here, never `public`. The database is shared
 * with the itgg-2026 app, which owns `itgg_2026`.
 */
export const ihelp = pgSchema("ihelp");

export const roleEnum = ihelp.enum("role", ["student", "insider", "admin"]);
export const resourceTypeEnum = ihelp.enum("resource_type", [
  "slide",
  "summary",
  "note",
]);
export const scopeEnum = ihelp.enum("scope", ["midterm", "final"]);

export const users = ihelp.table("users", {
  /** KMITL student id — the email local part, e.g. 69070027. */
  studentId: varchar("student_id", { length: 8 }).primaryKey(),
  /**
   * Link to the Supabase auth identity (`auth.users.id`).
   *
   * The foreign key is NOT declared here on purpose. drizzle-kit emits a
   * `CREATE TABLE "auth"."users"` for any pgSchema table referenced from this
   * file — `schemaFilter` does not suppress it — and running that against the
   * live database would collide with the auth schema that Supabase and the
   * itgg-2026 app both depend on. The constraint is added instead by
   * db/sql/0001_rls.sql, which is applied by hand.
   *
   * Nullable so a row can be seeded before that student ever signs in; the
   * auth callback claims it on first login. `auth.users` is shared with
   * itgg-2026, so a student may already have an identity there before their
   * first visit to iHelp.
   */
  authUserId: uuid("auth_user_id").unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  nickname: text("nickname"),
  /** One of the keys in lib/majors.ts: IT | DSBA | AIT | BIT. */
  major: text("major"),
  facebookUrl: text("facebook_url"),
  igUrl: text("ig_url"),
  /**
   * Object path in the public `ihelp-avatars` bucket for a picture the student
   * uploaded themselves. Null means fall back to `googleAvatarUrl`, which is
   * how "reset to my Google photo" works: clear this, keep that.
   */
  avatarUrl: text("avatar_url"),
  /**
   * Absolute URL of the Google account picture, refreshed on every sign-in.
   * Stored rather than read from the session because profile pages are public:
   * a visitor has no access to the profile owner's auth metadata.
   */
  googleAvatarUrl: text("google_avatar_url"),
  role: roleEnum("role").notNull().default("student"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/** Community uploads. Files live in the public `ihelp-resources` bucket. */
export const resources = ihelp.table(
  "resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Course code matching content/courses/<code>, e.g. 06016402. */
    subjectCode: text("subject_code").notNull(),
    title: text("title").notNull(),
    type: resourceTypeEnum("type").notNull(),
    /** Nullable: a running note belongs to the whole term, not one exam. */
    scope: scopeEnum("scope"),
    fileUrl: text("file_url").notNull(),
    uploaderId: varchar("uploader_id", { length: 8 })
      .notNull()
      .references(() => users.studentId, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("resources_subject_idx").on(t.subjectCode),
    index("resources_uploader_idx").on(t.uploaderId),
  ],
);

/**
 * Restricted. Readable only by role insider|admin — enforced in code by
 * requireInsider() (lib/auth/guards.ts), because Drizzle connects as the
 * `postgres` role and bypasses RLS. Files live in the PRIVATE `ihelp-exams`
 * bucket, so `fileUrl` is an object path, never a public URL.
 */
export const exams = ihelp.table(
  "exams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectCode: text("subject_code").notNull(),
    title: text("title").notNull(),
    examYear: integer("exam_year").notNull(),
    scope: scopeEnum("scope").notNull(),
    fileUrl: text("file_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("exams_subject_idx").on(t.subjectCode)],
);

/**
 * Footer visit counter, stored pre-aggregated: one row per visitor per day.
 *
 * `visitor_hash` is a salted SHA-256 of IP + user agent that is re-salted every
 * day, so it identifies a repeat visit within one day and nothing across days.
 * No IP, cookie, or account link is stored — a signed-in student is counted the
 * same way as an anonymous one.
 *
 * Because (day, visitor_hash) is the primary key, a plain COUNT(*) over one day
 * is already the unique-visitor count; `hits` carries the raw page views.
 *
 * Days are Asia/Bangkok days, not UTC ones — see lib/analytics.ts.
 */
export const siteVisits = ihelp.table(
  "site_visits",
  {
    day: date("day").notNull(),
    visitorHash: text("visitor_hash").notNull(),
    hits: integer("hits").notNull().default(1),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.day, t.visitorHash] }),
    index("site_visits_day_idx").on(t.day),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  resources: many(resources),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  uploader: one(users, {
    fields: [resources.uploaderId],
    references: [users.studentId],
  }),
}));

export type Role = (typeof roleEnum.enumValues)[number];
export type ResourceType = (typeof resourceTypeEnum.enumValues)[number];
export type Scope = (typeof scopeEnum.enumValues)[number];

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type Exam = typeof exams.$inferSelect;
export type NewExam = typeof exams.$inferInsert;
export type SiteVisit = typeof siteVisits.$inferSelect;
