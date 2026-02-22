import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { updateOrderStatusAction } from '@/lib/actions';

const statuses = ['All', 'Pending', 'Processing', 'Complete', 'Cancelled'] as const;

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status && statuses.includes(searchParams.status as any) ? searchParams.status : 'All';
  const orders = await prisma.order.findMany({
    where: status === 'All' ? {} : { status: status as any },
    orderBy: { createdAt: 'desc' },
    include: { user: true, product: true, offer: true, fieldValues: { include: { field: true } } }
  });
  return (
    <div>
      <h1>Order Management</h1>
      <div style={{display:'flex',gap:8,marginBottom:16}}>{statuses.map((s) => <Link className={`btn ${status===s?'':'btn-outline'}`} key={s} href={`/admin/orders?status=${s}`}>{s}</Link>)}</div>
      <div className="grid">
        {orders.map((o) => (
          <article key={o.id} className="card">
            <h3>Order #{o.id}</h3>
            <p>{o.user.name} / {o.product.name} / {o.offer.title} / NPR {o.offer.priceNpr}</p>
            <ul>{o.fieldValues.map((fv) => <li key={fv.id}>{fv.field.label}: {fv.value}</li>)}</ul>
            <p>Created: {new Date(o.createdAt).toLocaleString()}</p>
            <form action={updateOrderStatusAction} style={{display:'flex',gap:8}}>
              <input type="hidden" name="id" value={o.id} />
              <select className="input" name="status" defaultValue={o.status}>{statuses.filter((s)=>s!=='All').map((s)=><option key={s}>{s}</option>)}</select>
              <button className="btn">Update</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
