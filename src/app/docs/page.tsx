import DocsClient from '@/components/DocsClient';
import { SITE_NAME } from '@/lib/env';

export const metadata = { title: `Docs — ${SITE_NAME}` };

export default function DocsPage() {
  return <DocsClient />;
}
