import Link from 'next/link';
import { signupAction } from '@/lib/actions';

export default function SignupPage() {
  return (
    <main className="container" style={{ maxWidth: 460 }}>
      <h1>Create account</h1>
      <form action={signupAction} className="card grid">
        <div><label>Name<input className="input" name="name" required /></label></div>
        <div><label>Password<input className="input" type="password" name="password" required minLength={6} /></label></div>
        <button className="btn" type="submit">Sign up</button>
      </form>
      <p>Already registered? <Link href="/">Login</Link></p>
    </main>
  );
}
