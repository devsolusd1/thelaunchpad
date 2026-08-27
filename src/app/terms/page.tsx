import TermsClient from '@/components/TermsClient';
import { SITE_NAME } from '@/lib/env';

export const metadata = { title: `Terms of Service — ${SITE_NAME}` };

export default function TermsPage() {
  return <TermsClient />;
}
