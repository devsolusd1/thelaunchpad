import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Nav from '@/components/Nav';
import CreateTokenForm from '@/components/CreateTokenForm';

export const revalidate = 0;

export default async function CreateTokenPage({
  params,
}: {
  params: { site: string };
}) {
  const pad = await prisma.launchpad.findUnique({
    where: { slug: params.site.toLowerCase() },
  });
  if (!pad) notFound();

  return (
    <main>
      <Nav
        title={pad.name}
        logoUrl={pad.logoId ? `/api/img/${pad.logoId}` : null}
      />
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-3xl font-black text-white">Lancar token</h1>
        <p className="mt-2 text-sm text-gray-400">
          Curva desta launchpad: fee {pad.feeBps / 100}% · quote{' '}
          {pad.quoteSymbol} · MC ${pad.initialMcUsd.toLocaleString()} → $
          {pad.migrationMcUsd.toLocaleString()}
        </p>
        <div className="mt-8">
          <CreateTokenForm
            slug={pad.slug}
            configKey={pad.configKey}
            quoteMint={pad.quoteMint}
          />
        </div>
      </div>
    </main>
  );
}
