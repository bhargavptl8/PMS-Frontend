import { NextResponse } from 'next/server';

export function middleware(request) {
    console.log("Middleware triggered for:", request.url);
    const authToken = request.cookies.get('authToken')?.value;
    if (!authToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard","/dashboard/projects"]
};
