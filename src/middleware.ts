import { NextRequest, NextResponse } from 'next/server';

const ROOT = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000').toLowerCase();

// Extrai o subdominio do host: prosperity.thelaunchpad.com -> "prosperity"
function getSubdomain(host: string): string | null {
  const h = host.toLowerCase();
  if (h === ROOT || h === `www.${ROOT}`) return null;
  if (h.endsWith(`.${ROOT}`)) {
    const sub = h.slice(0, -(ROOT.length + 1));
    return sub === 'www' ? null : sub;
  }
  // dev: *.localhost:<porta> funciona nativamente no Chrome
  const devMatch = h.match(/^([a-z0-9-]+)\.localhost(:\d+)?$/);
  if (devMatch && devMatch[1] !== 'www') return devMatch[1];
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/s/') ||
    pathname.includes('.')
  )
    return NextResponse.next();

  const sub = getSubdomain(req.headers.get('host') || '');
  if (!sub) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/s/${sub}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
