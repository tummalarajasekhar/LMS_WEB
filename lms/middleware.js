import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define which roles can access which paths
const ROLE_PATHS = {
    admin: '/admin',
    faculty: '/faculty',
    student: '/student'
};

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // 1. SKIP PUBLIC PATHS (Login, Static files, APIs)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname === '/login' ||
        pathname === '/' ||
        // Allow the login API to pass through, otherwise no one can log in!
        pathname === '/api/login'
    ) {
        return NextResponse.next();
    }

    // 2. CHECK FOR TOKEN COOKIE
    const token = req.cookies.get('token')?.value;

    // If trying to access a protected page without a token -> Redirect to Login
    if (!token) {
        // If they are strictly trying to access /admin, /faculty, or /student
        if (pathname.startsWith('/admin') || pathname.startsWith('/faculty') || pathname.startsWith('/student')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.next();
    }

    // 3. VERIFY TOKEN VALIDITY
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const userRole = payload.role; // 'admin', 'faculty', or 'student'

        // 4. ROLE-BASED PROTECTION
        // Ensure user stays in their lane. A Student cannot visit /admin/*

        // Check if user is visiting a path meant for another role
        if (pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL(`/${userRole}/dashboard`, req.url));
        }
        if (pathname.startsWith('/faculty') && userRole !== 'faculty') {
            return NextResponse.redirect(new URL(`/${userRole}/dashboard`, req.url));
        }
        if (pathname.startsWith('/student') && userRole !== 'student') {
            return NextResponse.redirect(new URL(`/${userRole}/dashboard`, req.url));
        }

        // If they are logged in and visit '/login', throw them back to dashboard
        if (pathname === '/login') {
            return NextResponse.redirect(new URL(`/${userRole}/dashboard`, req.url));
        }

    } catch (error) {
        // If token is fake/expired -> Redirect to Login & Clear Cookie
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.delete('token');
        return response;
    }

    return NextResponse.next();
}

// Optimization: Only run middleware on these paths
export const config = {
    matcher: [
        '/admin/:path*',
        '/faculty/:path*',
        '/student/:path*',
        '/login',
        '/'
    ],
};