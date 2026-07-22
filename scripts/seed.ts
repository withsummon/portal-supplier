import { hash } from 'bcryptjs'
import { db } from '../src/db'
import {
  adminTeamMembers,
  categories,
  comments,
  conversations,
  messages,
  notifications,
  notes,
  payments,
  projectFiles,
  projects,
  sellers,
  sessions,
  statusHistory,
  teamMembers,
  users,
} from '../src/db/schema'

async function main() {
  await db.transaction(async (tx) => {
    await tx.delete(messages)
    await tx.delete(conversations)
    await tx.delete(notifications)
    await tx.delete(comments)
    await tx.delete(payments)
    await tx.delete(notes)
    await tx.delete(statusHistory)
    await tx.delete(projectFiles)
    await tx.delete(projects)
    await tx.delete(teamMembers)
    await tx.delete(adminTeamMembers)
    await tx.delete(sellers)
    await tx.delete(sessions)
    await tx.delete(users)
    await tx.delete(categories)

    const password = await hash('Password123!', 12)
    const [admin, sellerUser] = await tx
      .insert(users)
      .values([
        {
          email: 'admin@withsummon.com',
          password,
          name: 'Alicia Admin',
          role: 'ADMIN',
          emailVerified: true,
        },
        {
          email: 'seller@arya.local',
          password,
          name: 'Arya Seller',
          role: 'SELLER',
          emailVerified: true,
        },
      ])
      .returning()

    if (!admin || !sellerUser) {
      throw new Error('Failed to seed users')
    }

    await tx.insert(adminTeamMembers).values({
      userId: admin.id,
      department: 'Operations',
      role: 'Platform Administrator',
      status: 'ACTIVE',
      verified: true,
    })

    const [seller] = await tx
      .insert(sellers)
      .values({
        userId: sellerUser.id,
        companyName: 'Arya Seller Nusantara',
        industry: 'Technology',
        companySize: '11-50 employees',
        status: 'ACTIVE',
      })
      .returning()

    if (!seller) {
      throw new Error('Failed to seed seller')
    }

    await tx.insert(categories).values([
      { name: 'AI Automation', slug: 'ai-automation', type: 'PROJECT' },
      { name: 'Web Application', slug: 'web-application', type: 'PROJECT' },
    ])

    const [project] = await tx
      .insert(projects)
      .values({
        projectId: 'PRJ-001',
        name: 'Customer Support Automation',
        description: 'Build an AI-assisted workflow for handling customer support requests.',
        requirements: 'Dashboard, ticket routing, and reporting.',
        category: 'AI Automation',
        sellerId: seller.id,
        status: 'SUBMITTED',
        priority: 'HIGH',
        budgetCurrency: 'IDR',
        budgetRange: 'Rp 50.000.000 - Rp 100.000.000',
        source: 'SUMMON',
      })
      .returning()

    if (!project) {
      throw new Error('Failed to seed project')
    }

    await tx.insert(statusHistory).values({
      projectId: project.id,
      status: 'SUBMITTED',
      note: 'Project submitted by seller.',
      changedBy: sellerUser.id,
    })
  })

  console.error('Seed complete')
  console.error('Admin:', 'admin@withsummon.com', 'Password123!')
  console.error('Seller:', 'seller@arya.local', 'Password123!')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
