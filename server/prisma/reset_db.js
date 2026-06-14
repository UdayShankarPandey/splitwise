/**
 * reset_db.js — Clears all data from the database then re-seeds it.
 * Run with: node prisma/reset_db.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing all data...');

  // Delete in reverse dependency order to respect foreign key constraints
  await prisma.importAnomaly.deleteMany();
  await prisma.expenseParticipant.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.import.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ All data cleared.\n');
  console.log('🌱 Re-seeding...');

  const passwordHash = await bcrypt.hash('password123', 12);

  const [aisha, rohan, priya, meera, dev, sam] = await Promise.all([
    prisma.user.create({ data: { email: 'aisha@example.com', name: 'Aisha', passwordHash } }),
    prisma.user.create({ data: { email: 'rohan@example.com', name: 'Rohan', passwordHash } }),
    prisma.user.create({ data: { email: 'priya@example.com', name: 'Priya', passwordHash } }),
    prisma.user.create({ data: { email: 'meera@example.com', name: 'Meera', passwordHash } }),
    prisma.user.create({ data: { email: 'dev@example.com',   name: 'Dev',   passwordHash } }),
    prisma.user.create({ data: { email: 'sam@example.com',   name: 'Sam',   passwordHash } }),
  ]);
  console.log('✅ Created 6 users');

  const group = await prisma.group.create({
    data: {
      name: 'Flatmates',
      baseCurrency: 'INR',
      createdById: aisha.id
    }
  });
  console.log('✅ Created group: Flatmates');

  const JAN_1  = new Date('2026-01-01');
  const MAR_31 = new Date('2026-03-31');
  const APR_8  = new Date('2026-04-08');

  await prisma.membership.createMany({
    data: [
      { userId: aisha.id, groupId: group.id, role: 'admin',  joinDate: JAN_1 },
      { userId: rohan.id, groupId: group.id, role: 'member', joinDate: JAN_1 },
      { userId: priya.id, groupId: group.id, role: 'member', joinDate: JAN_1 },
      { userId: meera.id, groupId: group.id, role: 'member', joinDate: JAN_1, leaveDate: MAR_31 },
      { userId: dev.id,   groupId: group.id, role: 'member', joinDate: JAN_1 },
      { userId: sam.id,   groupId: group.id, role: 'member', joinDate: APR_8 },
    ]
  });
  console.log('✅ Created memberships');
  console.log('   - Meera: leaves 31 March 2026');
  console.log('   - Sam:   joins  8 April 2026');

  console.log('\n🎉 Reset complete!\n');
  console.log('📋 Login credentials (all users):');
  console.log('   Password: password123');
  console.log('   Emails: aisha@example.com, rohan@example.com, priya@example.com,');
  console.log('           meera@example.com, dev@example.com, sam@example.com');
}

main()
  .catch((e) => { console.error('❌ Reset failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
