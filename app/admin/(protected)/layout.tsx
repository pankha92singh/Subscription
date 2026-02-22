import type { ReactNode } from 'react';
import Link from 'next/link';
import { isAdminSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { adminLogoutAction } from '@/lib/actions';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminSession())) redirect('/admin/login');
  return (
    <div className="admin-wrap">
      <aside className="sidebar">
        <h2>NESUBS Admin</h2>
        <Link href="/admin/products">Product Management</Link>
        <Link href="/admin/orders">Order Management</Link>
        <form action={adminLogoutAction}><button className="btn" style={{marginTop:16}}>Logout</button></form>
      </aside>
      <main className="container">{children}</main>
    </div>
  );
}
