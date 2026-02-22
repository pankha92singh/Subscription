import { prisma } from '../lib/prisma';

async function main() {
  const count = await prisma.product.count();
  if (count) return;
  const pubg = await prisma.product.create({ data: { name: 'PUBG Mobile', slug: 'pubg-mobile', category: 'Games', description: 'Top-up UC quickly.\n\n- Instant request creation\n- Secure order tracking', iconUrl: '/uploads/default.svg', active: true } });
  await prisma.offer.createMany({ data: [
    { productId: pubg.id, title: '60 UC', priceNpr: 160, active: true, sortOrder: 0 },
    { productId: pubg.id, title: '325 UC', priceNpr: 750, active: true, sortOrder: 1 }
  ] });
  await prisma.productOrderField.createMany({ data: [
    { productId: pubg.id, label: 'Player ID', fieldType: 'text', required: true, sortOrder: 0 },
    { productId: pubg.id, label: 'Phone Number', fieldType: 'number', required: false, sortOrder: 1 },
    { productId: pubg.id, label: 'Description', fieldType: 'textarea', required: false, sortOrder: 2 }
  ] });
}

main().finally(() => prisma.$disconnect());
