import { prisma } from '@/lib/prisma';
import { saveProductAction, deleteProductAction } from '@/lib/actions';
import { ProductForm } from '@/components/ProductForm';

export default async function AdminProductsPage({ searchParams }: { searchParams: { edit?: string } }) {
  const products = await prisma.product.findMany({ include: { offers: true, orderFields: true }, orderBy: { createdAt: 'desc' } });
  const editing = searchParams.edit ? products.find((p) => p.id === Number(searchParams.edit)) : undefined;
  return (
    <div>
      <h1>Product Management</h1>
      <form action={saveProductAction} className="card grid">
        <h2>{editing ? `Edit #${editing.id}` : 'Create Product'}</h2>
        <ProductForm product={editing} />
        <button className="btn">Save Product</button>
      </form>
      <div className="section grid">
        {products.map((p) => (
          <div key={p.id} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><strong>{p.name}</strong> / {p.category} / {p.active ? 'Active' : 'Inactive'}</div>
            <div style={{display:'flex',gap:8}}>
              <a className="btn btn-outline" href={`/admin/products?edit=${p.id}`}>Edit</a>
              <form action={deleteProductAction}><input type="hidden" name="id" value={p.id} /><button className="btn btn-outline">Delete</button></form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
