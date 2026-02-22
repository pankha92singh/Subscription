import { adminLoginAction } from '@/lib/actions';

export default function AdminLoginPage() {
  return (
    <main className="container" style={{ maxWidth: 460 }}>
      <h1>Admin Login</h1>
      <form action={adminLoginAction} className="card grid">
        <label>Username<input className="input" name="username" required /></label>
        <label>Password<input className="input" type="password" name="password" required /></label>
        <button className="btn">Login</button>
      </form>
    </main>
  );
}
