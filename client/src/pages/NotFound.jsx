import { Link } from 'react-router-dom';

export default function NotFound({ inApp }) {
  return (
    <div className="nf">
      <h1>That page doesn't exist</h1>
      <p className="muted">The link may be old or mistyped.</p>
      <Link className="btn primary" to={inApp ? '/app' : '/'}>{inApp ? 'Back to dashboard' : 'Back to home'}</Link>
    </div>
  );
}
