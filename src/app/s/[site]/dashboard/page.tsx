import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Nav from '@/components/Nav';
import FeeDashboard from '@/components/FeeDashboard';

export const revalidate = 0;

export default async function DashboardPage({
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
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-black text-white">Launchpad fees</h1>
        <p className="mt-2 text-sm text-gray-400">
          Half of every trading fee from this launchpad&apos;s tokens is paid
          automatically to the owner&apos;s wallet. Public history below.
        </p>
        <div className="mt-8">
          <FeeDashboard slug={pad.slug} />
        </div>
      </div>
    </main>
  );
}
