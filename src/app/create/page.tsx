import Nav from '@/components/Nav';
import CreateLaunchpadForm from '@/components/CreateLaunchpadForm';
import { SITE_NAME } from '@/lib/env';

export default function CreateLaunchpadPage() {
  return (
    <main>
      <Nav title={SITE_NAME} />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-black text-white">Criar launchpad</h1>
        <p className="mt-2 text-sm text-gray-400">
          Voce assina uma unica transacao: criacao da config on-chain (Meteora
          DBC) + taxa de criacao. A partir dai, todo token lancado na sua
          launchpad usa a sua curva e gera fees divididas 50/50 com a
          plataforma.
        </p>
        <div className="mt-8">
          <CreateLaunchpadForm />
        </div>
      </div>
    </main>
  );
}
