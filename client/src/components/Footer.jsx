import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container foot-in">
        <div><Logo /><p className="muted small">Writing, imaging and resume tools in one workspace.</p></div>
        <nav aria-label="Footer">
          <a href="#tools">Tools</a><a href="#pricing">Pricing</a><a href="#reviews">Reviews</a>
          <Link to="/sign-in">Sign in</Link><Link to="/sign-up">Create account</Link>
        </nav>
      </div>
      <p className="container muted small copy">© {new Date().getFullYear()} Nexus AI</p>
    </footer>
  );
}
