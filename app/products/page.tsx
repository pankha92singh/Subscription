import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/session';
import { redirect } from 'next/navigation';
import { CATEGORY_ORDER } from '@/lib/constants';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { logoutUserAction } from '@/lib/actions';

export default async function ProductsPage() {
  if (!(await getUserId())) redirect('/');
  const products = await prisma.product.findMany({ where: { active: true }, include: { offers: true } });

  return (
    <main className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>NESUBS Marketplace</h1>
        <div style={{display:'flex',gap:8}}>
          <Link className="btn btn-outline" href="/orders">My Orders</Link>
          <form action={logoutUserAction}><button className="btn btn-outline">Logout</button></form>
        </div>
      </div>
      {CATEGORY_ORDER.map((category) => {
        const inCategory = products.filter((p) => p.category === category);
        return (
          <section key={category} className={`section ${category === 'Productivity' ? 'productivity' : ''}`}>
            <h2>{category}</h2>
            <div className="grid grid-3">{inCategory.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        );
      })}
    </main>
  );
}
