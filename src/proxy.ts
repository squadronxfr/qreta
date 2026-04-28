import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function proxy(request: NextRequest) {
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
    const {pathname} = request.nextUrl;

    const isApiRoute = pathname.startsWith('/api/stripe/webhooks');
    const isStaticAsset = pathname.startsWith('/_next') || pathname.includes('/api/auth');
    const isMaintenancePage = pathname === '/maintenance';
    const isPublicFolder = pathname.startsWith('/vercel.png') || pathname.startsWith('/favicon.ico');

    if (isMaintenanceMode) {
        if (!isMaintenancePage && !isApiRoute && !isStaticAsset && !isPublicFolder) {
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }
    } else {
        if (isMaintenancePage) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};