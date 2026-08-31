import Nav from '@/components/Nav';
import PadTokenClient from '@/components/PadTokenClient';
import { SITE_NAME } from '@/lib/env';

export const metadata = { title: `$PAD — ${SITE_NAME}` };

export default function PadTokenPage() {
  return (
    <main>
      <Nav title={SITE_NAME} siteLinks />
      <PadTokenClient />
    </main>
  );
}
