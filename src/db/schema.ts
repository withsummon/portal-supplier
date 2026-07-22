import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  pgEnum,
  decimal,
  index,
  uniqueIndex,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================
// ENUMS
// ============================================================

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'SELLER'])

export const sellerStatusEnum = pgEnum('seller_status', [
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
  'REJECTED',
])

export const sellerTierEnum = pgEnum('seller_tier', ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'])

export const projectStatusEnum = pgEnum('project_status', [
  'SUBMITTED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'NEED_CLARIFICATION',
  'IN_PROGRESS',
  'COMPLETED',
  'PAID',
  'CANCELLED',
])

export const projectPriorityEnum = pgEnum('project_priority', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

export const noteTypeEnum = pgEnum('note_type', ['CLARIFICATION', 'STATUS_CHANGE', 'GENERAL'])

export const conversationTypeEnum = pgEnum('conversation_type', ['INDIVIDUAL', 'GROUP', 'PROJECT'])

export const messageTypeEnum = pgEnum('message_type', ['TEXT', 'FILE', 'SYSTEM'])

export const notificationTypeEnum = pgEnum('notification_type', [
  'PROJECT_SUBMITTED',
  'PROJECT_ACCEPTED',
  'PROJECT_REJECTED',
  'PROJECT_CLARIFICATION',
  'PROJECT_STARTED',
  'PROJECT_COMPLETED',
  'PROJECT_PAID',
  'MESSAGE_RECEIVED',
  'SELLER_REGISTRATION',
  'SYSTEM',
])

export const categoryTypeEnum = pgEnum('category_type', ['PROJECT', 'PRODUCT'])

// ============================================================
// USER & AUTHENTICATION
// ============================================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'),
  name: text('name'),
  phone: text('phone'),
  location: text('location'),
  role: userRoleEnum('role').default('SELLER').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  preferences: jsonb('preferences').$type<Record<string, boolean>>().default({}),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type'),
    providerId: text('provider').notNull(),
    accountId: text('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {
      mode: 'date',
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
      mode: 'date',
      withTimezone: true,
    }),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
    password: text('password'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('accounts_provider_provider_account_id_idx').on(table.providerId, table.accountId),
  ],
)

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    token: text('session_token').notNull().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    expiresAt: timestamp('expires', { mode: 'date', withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('sessions_user_id_idx').on(table.userId),
    index('sessions_ip_address_idx').on(table.ipAddress),
  ],
)

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires', { mode: 'date', withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('verification_tokens_identifier_token_idx').on(table.identifier, table.token),
  ],
)

// ============================================================
// SELLER (Supplier) Management
// ============================================================

export const sellers = pgTable(
  'sellers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    companyName: text('company_name').notNull(),
    industry: text('industry'),
    companySize: text('company_size'),
    website: text('website'),
    description: text('description'),
    location: text('location'),
    logoUrl: text('logo_url'),
    status: sellerStatusEnum('status').default('PENDING').notNull(),
    tier: sellerTierEnum('tier').default('BRONZE').notNull(),
    dealsClosed: integer('deals_closed').default(0).notNull(),
    revenue: decimal('revenue', { precision: 12, scale: 2 }).default('0').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('sellers_user_id_idx').on(table.userId)],
)

// ============================================================
// PROJECT Management
// ============================================================

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: text('project_id').notNull().unique(), // PRJ-001 format
    name: text('name').notNull(),
    description: text('description').notNull(),
    requirements: text('requirements'),
    category: text('category').notNull(),
    clientName: text('client_name'),

    status: projectStatusEnum('status').default('SUBMITTED').notNull(),
    priority: projectPriorityEnum('priority').default('MEDIUM').notNull(),

    // Budget
    budgetMin: decimal('budget_min', { precision: 12, scale: 2 }),
    budgetMax: decimal('budget_max', { precision: 12, scale: 2 }),
    budgetCurrency: text('budget_currency').default('IDR').notNull(),
    budgetRange: text('budget_range'),

    // Timeline
    startDate: timestamp('start_date', { withTimezone: true }),
    endDate: timestamp('end_date', { withTimezone: true }),

    // Additional
    deliverables: jsonb('deliverables').$type<string[]>().default([]),
    techStack: jsonb('tech_stack').$type<string[]>().default([]),
    source: text('source').default('SUMMON'),

    // Relations
    sellerId: uuid('seller_id').references(() => sellers.id),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('projects_seller_id_idx').on(table.sellerId),
    index('projects_status_idx').on(table.status),
    index('projects_project_id_idx').on(table.projectId),
  ],
)

export const projectFiles = pgTable(
  'project_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    size: text('size').notNull(),
    type: text('type').notNull(),
    url: text('url'),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('project_files_project_id_idx').on(table.projectId)],
)

export const statusHistory = pgTable(
  'status_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    status: projectStatusEnum('status').notNull(),
    note: text('note'),
    changedBy: text('changed_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('status_history_project_id_idx').on(table.projectId)],
)

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    type: noteTypeEnum('type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by').notNull(),
  },
  (table) => [index('notes_project_id_idx').on(table.projectId)],
)

// ============================================================
// PAYMENTS (Project payment tracking)
// ============================================================

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    currency: text('currency').default('IDR').notNull(),
    paymentMethod: text('payment_method'),
    notes: text('notes'),
    paidAt: timestamp('paid_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('payments_project_id_idx').on(table.projectId)],
)

// ============================================================
// PRODUCTS (Factory/Summon Products)
// ============================================================

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    longDescription: text('long_description'),
    category: text('category').notNull(),
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').default('IDR').notNull(),
    features: jsonb('features').$type<string[]>().default([]),
    useCases: jsonb('use_cases').$type<string[]>().default([]),
    clients: jsonb('clients').$type<string[]>().default([]),
    images: jsonb('images').$type<string[]>().default([]),
    icon: text('icon'),
    iconBg: text('icon_bg'),
    iconColor: text('icon_color'),
    badge: text('badge'),
    pitchDeckPdf: text('pitch_deck_pdf'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('products_slug_idx').on(table.slug)],
)

// ============================================================
// MESSAGING System
// ============================================================

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    participants: jsonb('participants').$type<string[]>().default([]),
    type: conversationTypeEnum('type').default('INDIVIDUAL').notNull(),
    lastMessage: text('last_message'),
    lastAt: timestamp('last_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('conversations_last_at_idx').on(table.lastAt)],
)

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    senderId: uuid('sender_id')
      .notNull()
      .references(() => users.id),
    content: text('content').notNull(),
    type: messageTypeEnum('type').default('TEXT').notNull(),
    attachments: jsonb('attachments').$type<string[]>().default([]),
    readBy: jsonb('read_by').$type<string[]>().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('messages_conversation_id_idx').on(table.conversationId),
    index('messages_sender_id_idx').on(table.senderId),
  ],
)

// ============================================================
// NOTIFICATIONS
// ============================================================

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    link: text('link'),
    meta: jsonb('meta'),
    read: boolean('read').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('notifications_user_id_idx').on(table.userId)],
)

// ============================================================
// ADMIN TEAM
// ============================================================

export const adminTeamMembers = pgTable(
  'admin_team_members',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    department: text('department').notNull(),
    role: text('role').notNull(),
    status: text('status').default('active').notNull(),
    verified: boolean('verified').default(true).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('admin_team_members_user_id_idx').on(table.userId)],
)

// ============================================================
// TEAM MEMBERS (Seller's internal team)
// ============================================================

export const teamMembers = pgTable(
  'team_members',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellers.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    role: text('role').notNull(),
    avatar: text('avatar'),
    status: text('status').default('pending').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('team_members_seller_id_idx').on(table.sellerId)],
)

// ============================================================
// COMMENTS (Project discussions)
// ============================================================

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id),
    message: text('message').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('comments_project_id_idx').on(table.projectId),
    index('comments_author_id_idx').on(table.authorId),
  ],
)

// ============================================================
// CATEGORIES (For projects and products)
// ============================================================

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    type: categoryTypeEnum('type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('categories_name_idx').on(table.name),
    uniqueIndex('categories_slug_idx').on(table.slug),
  ],
)

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  seller: one(sellers, { fields: [users.id], references: [sellers.userId] }),
  adminTeam: one(adminTeamMembers, {
    fields: [users.id],
    references: [adminTeamMembers.userId],
  }),
  accounts: many(accounts),
  sessions: many(sessions),
  notifications: many(notifications),
  messages: many(messages),
  comments: many(comments),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const sellersRelations = relations(sellers, ({ one, many }) => ({
  user: one(users, { fields: [sellers.userId], references: [users.id] }),
  projects: many(projects),
  teamMembers: many(teamMembers),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  seller: one(sellers, { fields: [projects.sellerId], references: [sellers.id] }),
  files: many(projectFiles),
  statusHistory: many(statusHistory),
  notes: many(notes),
  comments: many(comments),
  payments: many(payments),
}))

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, {
    fields: [projectFiles.projectId],
    references: [projects.id],
  }),
}))

export const statusHistoryRelations = relations(statusHistory, ({ one }) => ({
  project: one(projects, {
    fields: [statusHistory.projectId],
    references: [projects.id],
  }),
}))

export const notesRelations = relations(notes, ({ one }) => ({
  project: one(projects, { fields: [notes.projectId], references: [projects.id] }),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  project: one(projects, { fields: [payments.projectId], references: [projects.id] }),
}))

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

export const adminTeamMembersRelations = relations(adminTeamMembers, ({ one }) => ({
  user: one(users, {
    fields: [adminTeamMembers.userId],
    references: [users.id],
  }),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  seller: one(sellers, {
    fields: [teamMembers.sellerId],
    references: [sellers.id],
  }),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  project: one(projects, {
    fields: [comments.projectId],
    references: [projects.id],
  }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
}))
