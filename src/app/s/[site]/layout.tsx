import Script from 'next/script';
import { prisma } from '@/lib/db';
import { shadeHex } from '@/lib/format';
import { SITE_NAME, ROOT_DOMAIN } from '@/lib/env';
import { FlameMark } from '@/components/Nav';

// Layout de todas as paginas de um pad: injeta a cor do dono (--pad),
// o Google Analytics do dono (se configurado) e o selo "Powered by".
export default async function PadLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { site: string };
}) {
  const pad = await prisma.launchpad.findUnique({
    where: { slug: params.site.toLowerCase() },
    select: { accentColor: true, gaId: true },
  });
  const color = pad?.accentColor || '#d9631c';
  const color2 = shadeHex(color, 1.28);

  return (
    <div
      className="pg-pad"
      style={{ ['--pad' as any]: color, ['--pad2' as any]: color2 }}
    >
      {pad?.gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${pad.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${pad.gaId}');`}
          </Script>
        </>
      )}
      {children}
      <a
        className="powered"
        href={`${ROOT_DOMAIN.includes('localhost') ? 'http' : 'https'}://${ROOT_DOMAIN}`}
        title="Launch your own launchpad"
      >
        <span className="pw-mark">
          <FlameMark size={15} />
        </span>
        <span>
          <em>Powered by</em>
          <b>{SITE_NAME}</b>
        </span>
      </a>
    </div>
  );
}
