'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { createAdminSession, createUserSession, destroyAdminSession, destroyUserSession, getUserId } from './session';
import { CATEGORY_ORDER, FIELD_TYPES } from './constants';

export async function signupAction(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const password = String(formData.get('password') || '');
  if (!name || !password) return { error: 'Name and password are required.' };
  const exists = await prisma.user.findUnique({ where: { name } });
  if (exists) return { error: 'Name already in use.' };
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, passwordHash } });
  await createUserSession(user.id);
  redirect('/products');
}

export async function loginAction(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const password = String(formData.get('password') || '');
  const user = await prisma.user.findUnique({ where: { name } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return { error: 'Invalid credentials.' };
  await createUserSession(user.id);
  redirect('/products');
}

export async function logoutUserAction() { await destroyUserSession(); redirect('/'); }

export async function adminLoginAction(formData: FormData) {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  if (username === (process.env.ADMIN_USERNAME || 'admin') && password === (process.env.ADMIN_PASSWORD || 'admin66551100')) {
    await createAdminSession();
    redirect('/admin/products');
  }
  return { error: 'Invalid admin credentials.' };
}

export async function adminLogoutAction() { await destroyAdminSession(); redirect('/admin/login'); }

export async function saveProductAction(formData: FormData) {
  const id = formData.get('id') ? Number(formData.get('id')) : undefined;
  const name = String(formData.get('name') || '');
  const slug = String(formData.get('slug') || '');
  const category = String(formData.get('category') || 'Games');
  if (!CATEGORY_ORDER.includes(category as never)) return { error: 'Invalid category' };
  const description = String(formData.get('description') || '');
  const iconUrl = String(formData.get('iconUrl') || '/uploads/default.svg');
  const active = formData.get('active') === 'on';

  const offers = JSON.parse(String(formData.get('offersJson') || '[]')) as any[];
  const fields = JSON.parse(String(formData.get('fieldsJson') || '[]')) as any[];

  const payload = { name, slug, category: category as any, description, iconUrl, active };
  if (id) {
    await prisma.product.update({ where: { id }, data: payload });
    await prisma.offer.deleteMany({ where: { productId: id } });
    await prisma.productOrderField.deleteMany({ where: { productId: id } });
    await prisma.offer.createMany({ data: offers.map((o, i) => ({ productId: id, title: o.title, priceNpr: Number(o.priceNpr), note: o.note || null, active: !!o.active, sortOrder: i })) });
    await prisma.productOrderField.createMany({ data: fields.filter((f) => FIELD_TYPES.includes(f.fieldType)).map((f, i) => ({ productId: id, label: f.label, fieldType: f.fieldType, required: !!f.required, sortOrder: i })) });
  } else {
    const p = await prisma.product.create({ data: payload });
    await prisma.offer.createMany({ data: offers.map((o, i) => ({ productId: p.id, title: o.title, priceNpr: Number(o.priceNpr), note: o.note || null, active: !!o.active, sortOrder: i })) });
    await prisma.productOrderField.createMany({ data: fields.filter((f) => FIELD_TYPES.includes(f.fieldType)).map((f, i) => ({ productId: p.id, label: f.label, fieldType: f.fieldType, required: !!f.required, sortOrder: i })) });
  }

  revalidatePath('/products');
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProductAction(formData: FormData) {
  await prisma.product.delete({ where: { id: Number(formData.get('id')) } });
  revalidatePath('/admin/products');
}

export async function createOrderAction(formData: FormData) {
  const userId = await getUserId();
  if (!userId) redirect('/');
  const productId = Number(formData.get('productId'));
  const offerId = Number(formData.get('offerId'));

  const productFields = await prisma.productOrderField.findMany({ where: { productId }, orderBy: { sortOrder: 'asc' } });
  for (const field of productFields) {
    const value = String(formData.get(`field_${field.id}`) || '').trim();
    if (field.required && !value) return { error: `${field.label} is required.` };
  }

  const order = await prisma.order.create({ data: { userId, productId, offerId, status: 'Pending' } });
  for (const field of productFields) {
    const value = String(formData.get(`field_${field.id}`) || '').trim();
    if (value) await prisma.orderFieldValue.create({ data: { orderId: order.id, fieldId: field.id, value } });
  }
  revalidatePath('/orders');
  redirect('/orders');
}

export async function updateOrderStatusAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const status = String(formData.get('status')) as any;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath('/admin/orders');
}
