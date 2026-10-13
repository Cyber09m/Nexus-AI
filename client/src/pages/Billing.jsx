import { PricingTable } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { Crown } from 'lucide-react';
import { useMe } from '../lib/me.jsx';
import UsageMeter from '../components/UsageMeter.jsx';

export default function Billing() {
  const { me } = useMe();
  return (
    <div>
      <header className="page-head"><h1>Plan and billing</h1><p className="muted">See your usage, change plans and manage payment details.</p></header>
      <div className="glass panel plan-now">
        <div>
          <span className={`badge ${me?.premium ? 'premium' : ''}`}>{me?.premium ? <><Crown size={13} /> Premium</> : 'Free plan'}</span>
          <p className="muted small">{me?.premium ? 'You have unlimited generations and every tool.' : 'Free includes a monthly allowance and the writing and resume tools.'}</p>
        </div>
        <div className="grow"><UsageMeter /></div>
      </div>
      <div className="pricing-wrap"><PricingTable appearance={{ baseTheme: dark }} /></div>
    </div>
  );
}
