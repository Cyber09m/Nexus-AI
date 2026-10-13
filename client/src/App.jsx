import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing.jsx';
import AppLayout from './pages/AppLayout.jsx';
import NeuralBackground from './components/NeuralBackground.jsx';
import Logo from './components/Logo.jsx';
import NotFound from './pages/NotFound.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Article = lazy(() => import('./pages/Article.jsx'));
const Titles = lazy(() => import('./pages/Titles.jsx'));
const Images = lazy(() => import('./pages/Images.jsx'));
const Background = lazy(() => import('./pages/Background.jsx'));
const RemoveObject = lazy(() => import('./pages/RemoveObject.jsx'));
const Resume = lazy(() => import('./pages/Resume.jsx'));
const History = lazy(() => import('./pages/History.jsx'));
const Billing = lazy(() => import('./pages/Billing.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));

function Protected({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

function AuthPage({ children }) {
  return (
    <div className="auth">
      <NeuralBackground />
      <div className="aurora" aria-hidden="true"><i /><i /></div>
      <div className="auth-in"><Logo />{children}</div>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <>
      <Suspense fallback={<div className="boot" aria-busy="true"><div className="spinner" /></div>}>
        <Routes key={pathname.startsWith('/app') ? 'app' : pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-in/*" element={<AuthPage><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" /></AuthPage>} />
          <Route path="/sign-up/*" element={<AuthPage><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" /></AuthPage>} />
          <Route path="/app" element={<Protected><AppLayout /></Protected>}>
            <Route index element={<Dashboard />} />
            <Route path="article" element={<Article />} />
            <Route path="titles" element={<Titles />} />
            <Route path="image" element={<Images />} />
            <Route path="background" element={<Background />} />
            <Route path="object" element={<RemoveObject />} />
            <Route path="resume" element={<Resume />} />
            <Route path="history" element={<History />} />
            <Route path="billing" element={<Billing />} />
            <Route path="account/*" element={<Account />} />
            <Route path="*" element={<NotFound inApp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#161233', color: '#ecebff', border: '1px solid rgba(255,255,255,.12)' } }} />
    </>
  );
}
