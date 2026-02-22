import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const userId = await getUserId();
  if (!userId) redirect('/');
  const orders = await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { product: true, offer: true, fieldValues: { include: { field: true } } } });
  return (
    <main className="container">
      <a href="/products">← Back to products</a>
      <h1>My Orders</h1>
      <div className="grid">
        {orders.map((order) => (
          <article key={order.id} className="card">
            <h3>#{order.id} - {order.product.name} ({order.offer.title})</h3>
            <p>Status: <strong>{order.status}</strong></p>
            <ul>{order.fieldValues.map((fv) => <li key={fv.id}>{fv.field.label}: {fv.value}</li>)}</ul>
          </article>
        ))}
      </div>
    </main>
  );
}
