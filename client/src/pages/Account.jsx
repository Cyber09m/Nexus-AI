import { UserProfile } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

export default function Account() {
  return (
    <div>
      <header className="page-head"><h1>Profile</h1><p className="muted">Update your details, security settings and connected accounts.</p></header>
      <div className="profile-wrap"><UserProfile routing="hash" appearance={{ baseTheme: dark }} /></div>
    </div>
  );
}
