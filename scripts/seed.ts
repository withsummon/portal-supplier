import { hash } from 'bcryptjs'
import { sql } from 'drizzle-orm'
import { db, pool } from '../src/db'
import {
  adminTeamMembers,
  categories,
  comments,
  conversations,
  messages,
  notifications,
  notes,
  products,
  projectFiles,
  projects,
  quotes,
  sellers,
  statusHistory,
  teamMembers,
  users,
  vendors,
  accounts,
} from '../src/db/schema'

function required<T>(value: T | undefined, label: string): T {
  if (!value) {
    throw new Error(`Missing seed record: ${label}`)
  }

  return value
}

async function main() {
  const passwordHash = await hash('Password123!', 12)

  await db.execute(sql`
    TRUNCATE TABLE
      comments,
      messages,
      conversations,
      notifications,
      quotes,
      notes,
      status_history,
      project_files,
      team_members,
      admin_team_members,
      projects,
      products,
      vendors,
      sellers,
      sessions,
      verification_tokens,
      accounts,
      users,
      categories
    RESTART IDENTITY CASCADE
  `)

  const insertedUsers = await db
    .insert(users)
    .values([
      {
        email: 'admin@withsummon.com',
        password: passwordHash,
        name: 'Alicia Admin',
        role: 'ADMIN',
        phone: '+62 811-0000-0001',
        location: 'Jakarta',
        preferences: {},
      },
      {
        email: 'reviewer@withsummon.com',
        password: passwordHash,
        name: 'Rama Reviewer',
        role: 'ADMIN',
        phone: '+62 811-0000-0002',
        location: 'Jakarta',
        preferences: {},
      },
      {
        email: 'seller@arya.local',
        password: passwordHash,
        name: 'Budi Santoso',
        role: 'SELLER',
        phone: '+62 811-1111-1111',
        location: 'Bandung',
        preferences: {},
      },
      {
        email: 'seller2@digital.local',
        password: passwordHash,
        name: 'Maya Putri',
        role: 'SELLER',
        phone: '+62 811-1111-1112',
        location: 'Surabaya',
        preferences: {},
      },
      {
        email: 'vendor@cloudforge.local',
        password: passwordHash,
        name: 'Dimas Pratama',
        role: 'VENDOR',
        phone: '+62 811-2222-2221',
        location: 'Jakarta',
        preferences: {},
      },
      {
        email: 'vendor2@visionworks.local',
        password: passwordHash,
        name: 'Nina Wijaya',
        role: 'VENDOR',
        phone: '+62 811-2222-2222',
        location: 'Yogyakarta',
        preferences: {},
      },
    ])
    .returning()

  await db.insert(accounts).values(
    insertedUsers.map((user) => ({
      userId: user.id,
      type: 'credential',
      providerId: 'credential',
      accountId: user.email,
      password: passwordHash,
    })),
  )

  const adminOwner = required(insertedUsers[0], 'adminOwner')
  const adminReviewer = required(insertedUsers[1], 'adminReviewer')
  const sellerOwner = required(insertedUsers[2], 'sellerOwner')
  const sellerGrowth = required(insertedUsers[3], 'sellerGrowth')
  const vendorCloud = required(insertedUsers[4], 'vendorCloud')
  const vendorVision = required(insertedUsers[5], 'vendorVision')

  const insertedAdminTeam = await db
    .insert(adminTeamMembers)
    .values([
      {
        userId: adminOwner.id,
        department: 'Operations',
        role: 'Platform Administrator',
        status: 'active',
        verified: true,
        isActive: true,
      },
      {
        userId: adminReviewer.id,
        department: 'Engineering',
        role: 'Technical Reviewer',
        status: 'pending',
        verified: false,
        isActive: true,
      },
    ])
    .returning()

  const adminOwnerTeam = required(insertedAdminTeam[0], 'adminOwnerTeam')
  const adminReviewerTeam = required(insertedAdminTeam[1], 'adminReviewerTeam')

  const insertedSellers = await db
    .insert(sellers)
    .values([
      {
        userId: sellerOwner.id,
        companyName: 'PT Arya Teknologi',
        industry: 'Cloud Infrastructure',
        companySize: '51-200',
        website: 'https://arya.example',
        description: 'Enterprise transformation partner for regulated businesses.',
        location: 'Bandung',
        logoUrl: null,
        status: 'ACTIVE',
        tier: 'GOLD',
        dealsClosed: 8,
        revenue: '420000.00',
      },
      {
        userId: sellerGrowth.id,
        companyName: 'Digital Solusi Indonesia',
        industry: 'Conversational AI',
        companySize: '11-50',
        website: 'https://digitalsolusi.example',
        description: 'Growth-focused solution seller for retail and services.',
        location: 'Surabaya',
        logoUrl: null,
        status: 'PENDING',
        tier: 'SILVER',
        dealsClosed: 3,
        revenue: '98000.00',
      },
    ])
    .returning()

  const sellerAlpha = required(insertedSellers[0], 'sellerAlpha')
  const sellerBeta = required(insertedSellers[1], 'sellerBeta')

  const insertedVendors = await db
    .insert(vendors)
    .values([
      {
        userId: vendorCloud.id,
        companyName: 'CloudForge Systems',
        industry: 'Cloud Infrastructure',
        companySize: '51-200',
        website: 'https://cloudforge.example',
        description: 'AWS and platform engineering delivery partner.',
        location: 'Jakarta',
        logoUrl: null,
        status: 'ACTIVE',
        tier: 'PLATINUM',
        activeProjects: 4,
        revenue: '610000.00',
      },
      {
        userId: vendorVision.id,
        companyName: 'VisionWorks Labs',
        industry: 'Computer Vision',
        companySize: '11-50',
        website: 'https://visionworks.example',
        description: 'Computer vision and applied AI implementation studio.',
        location: 'Yogyakarta',
        logoUrl: null,
        status: 'ACTIVE',
        tier: 'GOLD',
        activeProjects: 2,
        revenue: '275000.00',
      },
    ])
    .returning()

  const vendorAlpha = required(insertedVendors[0], 'vendorAlpha')
  const vendorBeta = required(insertedVendors[1], 'vendorBeta')

  await db.insert(teamMembers).values([
    {
      sellerId: sellerAlpha.id,
      name: 'Sari Wulandari',
      email: 'sari@arya.example',
      phone: '+62 811-3333-1001',
      role: 'Project Manager',
      status: 'active',
      isActive: true,
    },
    {
      sellerId: sellerAlpha.id,
      name: 'Rian Nugraha',
      email: 'rian@arya.example',
      phone: '+62 811-3333-1002',
      role: 'Technical Lead',
      status: 'pending',
      isActive: true,
    },
  ])

  await db.insert(categories).values([
    { name: 'Cloud Infrastructure', slug: 'cloud-infrastructure', type: 'PROJECT' },
    { name: 'Conversational AI', slug: 'conversational-ai-project', type: 'PROJECT' },
    { name: 'Computer Vision', slug: 'computer-vision-project', type: 'PROJECT' },
    { name: 'Infrastructure', slug: 'infrastructure', type: 'PRODUCT' },
    { name: 'Analytics', slug: 'analytics', type: 'PRODUCT' },
    { name: 'Security', slug: 'security', type: 'PRODUCT' },
  ])

  const insertedProjects = await db
    .insert(projects)
    .values([
      {
        projectId: 'PRJ-001',
        name: 'Cloud Infrastructure Migration',
        description: 'Migrate on-premise infrastructure to AWS with zero-downtime deployment.',
        requirements: 'Need experienced DevOps team with AWS and Kubernetes expertise.',
        category: 'Cloud Infrastructure',
        clientName: 'PT Maju Bersama',
        status: 'ACCEPTED',
        priority: 'HIGH',
        budgetMin: '50000.00',
        budgetMax: '100000.00',
        budgetCurrency: 'USD',
        budgetRange: '$50K - $100K',
        startDate: new Date('2026-05-01T00:00:00.000Z'),
        endDate: new Date('2026-08-30T00:00:00.000Z'),
        deliverables: ['AWS architecture', 'Terraform modules', 'Kubernetes cluster'],
        techStack: ['AWS', 'Terraform', 'Kubernetes', 'Docker'],
        source: 'SUMMON',
        sellerId: sellerAlpha.id,
      },
      {
        projectId: 'PRJ-002',
        name: 'AI Chatbot Implementation',
        description: 'Build an AI-powered chatbot for customer service automation.',
        requirements: 'Must support Indonesian language and integrate with existing CRM.',
        category: 'Conversational AI',
        clientName: 'PT Nusantara Retail',
        status: 'NEED_CLARIFICATION',
        priority: 'MEDIUM',
        budgetMin: '35000.00',
        budgetMax: '50000.00',
        budgetCurrency: 'USD',
        budgetRange: '$35K - $50K',
        startDate: new Date('2026-06-01T00:00:00.000Z'),
        endDate: new Date('2026-09-15T00:00:00.000Z'),
        deliverables: ['Chatbot web app', 'Admin dashboard', 'Integration API'],
        techStack: ['Python', 'LangChain', 'React', 'PostgreSQL'],
        source: 'SUMMON',
        sellerId: sellerBeta.id,
      },
      {
        projectId: 'PRJ-003',
        name: 'Computer Vision Quality Control',
        description: 'Deploy a visual inspection system for manufacturing quality control.',
        requirements: 'Must detect defects with 99% accuracy and handle 1000 images per minute.',
        category: 'Computer Vision',
        clientName: 'PT Pabrik Sentosa',
        status: 'SUBMITTED',
        priority: 'CRITICAL',
        budgetMin: '80000.00',
        budgetMax: '120000.00',
        budgetCurrency: 'USD',
        budgetRange: '$80K - $120K',
        startDate: new Date('2026-05-15T00:00:00.000Z'),
        endDate: new Date('2026-10-30T00:00:00.000Z'),
        deliverables: ['CV models', 'Realtime dashboard', 'Monitoring API'],
        techStack: ['Python', 'OpenCV', 'PyTorch', 'AWS'],
        source: 'SUMMON',
        sellerId: sellerAlpha.id,
      },
    ])
    .returning()

  const projectAlpha = required(insertedProjects[0], 'projectAlpha')
  const projectBeta = required(insertedProjects[1], 'projectBeta')
  const projectGamma = required(insertedProjects[2], 'projectGamma')

  await db.insert(projectFiles).values([
    {
      projectId: projectAlpha.id,
      name: 'cloud-migration-brief.pdf',
      size: '1.4 MB',
      type: 'application/pdf',
      url: '/file.svg',
    },
    {
      projectId: projectBeta.id,
      name: 'chatbot-requirements.pdf',
      size: '960 KB',
      type: 'application/pdf',
      url: '/file.svg',
    },
  ])

  await db.insert(statusHistory).values([
    {
      projectId: projectAlpha.id,
      status: 'SUBMITTED',
      note: 'Project submitted successfully.',
      changedBy: sellerOwner.id,
    },
    {
      projectId: projectAlpha.id,
      status: 'ACCEPTED',
      note: 'Approved for vendor proposal intake.',
      changedBy: adminOwner.id,
    },
    {
      projectId: projectBeta.id,
      status: 'SUBMITTED',
      note: 'Project submitted successfully.',
      changedBy: sellerGrowth.id,
    },
    {
      projectId: projectBeta.id,
      status: 'NEED_CLARIFICATION',
      note: 'Please clarify target CRM and expected daily conversation volume.',
      changedBy: adminReviewer.id,
    },
    {
      projectId: projectGamma.id,
      status: 'SUBMITTED',
      note: 'Project submitted successfully.',
      changedBy: sellerOwner.id,
    },
  ])

  await db.insert(notes).values([
    {
      projectId: projectAlpha.id,
      text: 'Approved for vendor proposal intake.',
      type: 'STATUS_CHANGE',
      createdBy: adminOwner.id,
    },
    {
      projectId: projectBeta.id,
      text: 'Please clarify target CRM and expected daily conversation volume.',
      type: 'CLARIFICATION',
      createdBy: adminReviewer.id,
    },
  ])

  await db.insert(comments).values([
    {
      projectId: projectBeta.id,
      authorId: adminReviewer.id,
      message: 'Please confirm the CRM vendor and expected message concurrency.',
    },
    {
      projectId: projectBeta.id,
      authorId: sellerGrowth.id,
      message: 'Client uses Salesforce and expects 15k conversations per day.',
    },
    {
      projectId: projectAlpha.id,
      authorId: vendorCloud.id,
      message: 'We can deliver this migration with a staged cutover plan.',
    },
  ])

  await db.insert(quotes).values([
    {
      projectId: projectAlpha.id,
      vendorId: vendorAlpha.id,
      amount: '78000.00',
      currency: 'USD',
      duration: 90,
      proposal: 'Dedicated platform squad with staged migration, IaC, and blue/green cutover.',
      status: 'PENDING',
    },
    {
      projectId: projectGamma.id,
      vendorId: vendorBeta.id,
      amount: '110000.00',
      currency: 'USD',
      duration: 120,
      proposal: 'Computer vision pipeline with active learning and MLOps handoff.',
      status: 'PENDING',
    },
  ])

  await db.insert(products).values([
    {
      name: 'Summon Analytics Copilot',
      slug: 'summon-analytics-copilot',
      description: 'Self-serve analytics assistant for revenue teams.',
      longDescription:
        'Embedded analytics assistant with governed data access, dashboard generation, and operational insights.',
      category: 'analytics',
      basePrice: '25000.00',
      currency: 'USD',
      features: ['Dashboard generation', 'Role-based insights', 'Governed data access'],
      useCases: ['Sales reporting', 'Ops review', 'Executive summaries'],
      clients: ['Retail', 'FMCG'],
      images: ['/products/overview-analytics.png'],
      icon: 'BarChart3',
      iconBg: 'var(--blue-50)',
      iconColor: 'var(--blue-600)',
      badge: 'Popular',
      pitchDeckPdf: null,
      isActive: true,
    },
    {
      name: 'Summon Support Chatbot',
      slug: 'summon-support-chatbot',
      description: 'Customer support automation with multilingual handoff.',
      longDescription:
        'Conversation orchestration, knowledge retrieval, escalation, and QA tooling for support operations.',
      category: 'conversational-ai',
      basePrice: '32000.00',
      currency: 'USD',
      features: ['Knowledge retrieval', 'Agent handoff', 'Conversation analytics'],
      useCases: ['Customer support', 'Lead qualification'],
      clients: ['Banking', 'Retail'],
      images: ['/products/overview-chatbot.png'],
      icon: 'MessageSquare',
      iconBg: 'var(--color-purple-bg)',
      iconColor: 'var(--color-purple)',
      badge: '',
      pitchDeckPdf: null,
      isActive: true,
    },
    {
      name: 'Summon Cloud Landing Zone',
      slug: 'summon-cloud-landing-zone',
      description: 'Baseline cloud platform package for regulated workloads.',
      longDescription:
        'Infrastructure baseline covering network topology, IAM, observability, CI/CD, and compliance controls.',
      category: 'infrastructure',
      basePrice: '48000.00',
      currency: 'USD',
      features: ['IAM baseline', 'Observability stack', 'CI/CD templates'],
      useCases: ['Cloud migration', 'Platform modernization'],
      clients: ['Fintech', 'Healthcare'],
      images: ['/products/overview-infra.png'],
      icon: 'Server',
      iconBg: 'var(--color-success-bg)',
      iconColor: 'var(--color-success)',
      badge: 'New',
      pitchDeckPdf: null,
      isActive: true,
    },
  ])

  const insertedConversations = await db
    .insert(conversations)
    .values([
      {
        participants: [adminOwner.id, sellerOwner.id],
        type: 'INDIVIDUAL',
        lastMessage: 'Please upload the final client architecture diagram.',
      },
      {
        participants: [adminOwner.id, vendorCloud.id],
        type: 'PROJECT',
        lastMessage: 'Your proposal has been received and is under review.',
      },
    ])
    .returning()

  const sellerConversation = required(insertedConversations[0], 'sellerConversation')
  const vendorConversation = required(insertedConversations[1], 'vendorConversation')

  await db.insert(messages).values([
    {
      conversationId: sellerConversation.id,
      senderId: adminOwner.id,
      content: 'Please upload the final client architecture diagram.',
      type: 'TEXT',
      readBy: [adminOwner.id],
    },
    {
      conversationId: sellerConversation.id,
      senderId: sellerOwner.id,
      content: 'Understood. We will upload it today.',
      type: 'TEXT',
      readBy: [adminOwner.id, sellerOwner.id],
    },
    {
      conversationId: vendorConversation.id,
      senderId: vendorCloud.id,
      content: 'We can start discovery next Monday if the client approves.',
      type: 'TEXT',
      readBy: [vendorCloud.id],
    },
    {
      conversationId: vendorConversation.id,
      senderId: adminOwner.id,
      content: 'Your proposal has been received and is under review.',
      type: 'TEXT',
      readBy: [adminOwner.id, vendorCloud.id],
    },
  ])

  await db.insert(notifications).values([
    {
      userId: sellerOwner.id,
      type: 'PROJECT_ACCEPTED',
      title: 'Project accepted',
      content: 'Cloud Infrastructure Migration is ready for vendor proposals.',
      link: `/projects/${projectAlpha.id}`,
    },
    {
      userId: sellerGrowth.id,
      type: 'PROJECT_CLARIFICATION',
      title: 'Clarification requested',
      content: 'Please clarify CRM and expected conversation volume.',
      link: `/projects/${projectBeta.id}`,
    },
    {
      userId: vendorCloud.id,
      type: 'MESSAGE_RECEIVED',
      title: 'New project message',
      content: 'Summon commented on Cloud Infrastructure Migration.',
      link: `/vendor/projects/${projectAlpha.id}`,
    },
    {
      userId: adminOwner.id,
      type: 'PROJECT_SUBMITTED',
      title: 'New project submitted',
      content: 'Computer Vision Quality Control has been submitted.',
      link: '/admin/projects',
    },
  ])

  console.error('Seed completed.')
  console.error('Admin:', adminOwner.email, 'Password123!')
  console.error('Seller:', sellerOwner.email, 'Password123!')
  console.error('Vendor:', vendorCloud.email, 'Password123!')
  console.error('Admin team members:', adminOwnerTeam.id, adminReviewerTeam.id)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
