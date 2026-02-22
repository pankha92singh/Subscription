import Link from 'next/link';
import { loginAction } from '@/lib/actions';
import { getUserId } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  if (await getUserId()) redirect('/products');
  return (
    <main className="container" style={{ maxWidth: 460 }}>
      <h1>NESUBS Login</h1>
      <form action={loginAction} className="card grid">
        <div><label>Name<input className="input" name="name" required /></label></div>
        <div><label>Password<input className="input" type="password" name="password" required /></label></div>
        <button className="btn" type="submit">Login</button>
      </form>
      <p>Don&apos;t have an account? <Link href="/signup">Sign up</Link></p>
    </main>
  );
}
