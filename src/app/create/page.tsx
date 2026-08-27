import Nav from '@/components/Nav';
import CreateLaunchpadForm from '@/components/CreateLaunchpadForm';
import { SITE_NAME } from '@/lib/env';

export default function CreateLaunchpadPage() {
  return (
    <main>
      <Nav title={SITE_NAME} siteLinks />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-black text-white">Create launchpad</h1>
        <p className="mt-2 text-sm text-gray-400">
          You sign a single transaction: the on-chain config creation (Meteora
          DBC) + the creation fee. From then on, every token launched on your
          pad uses your curve and generates fees split 50/50 with the
          platform.
        </p>
        <div className="mt-8">
          <CreateLaunchpadForm />
        </div>
      </div>
    </main>
  );
}
