import Nav from '@/components/Nav';
import CreatePadWizard from '@/components/create/CreatePadWizard';
import { SITE_NAME } from '@/lib/env';

export const metadata = { title: `Create launchpad — ${SITE_NAME}` };

export default function CreateLaunchpadPage() {
  return (
    <div className="pg-create">
      <div className="bgfx"></div>
      <Nav title={SITE_NAME} siteLinks />
      <CreatePadWizard />
    </div>
  );
}
