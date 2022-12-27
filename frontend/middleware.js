import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const url = request.nextUrl.clone()

    const jwt = request.cookies.get("token")?.value;
    const secret =  new TextEncoder().encode(process.env.JWT_SECRET);

    if(pathname.startsWith("/auth")) {
        if (jwt == undefined) {
            return NextResponse.next()
        } else {
            try {
                const verified = await jwtVerify(jwt, secret);
                if(verified) {
                    url.pathname = "/dashboard";
                    return NextResponse.redirect(url);
                }
            } catch(e) {
                request.cookies.set("token", "", { expires: new Date(Date.now()) });
                return NextResponse.next();
            }
        }
    }

    if(pathname.startsWith("/dashboard")) {
        if (jwt == undefined) {
            url.pathname = "/auth/login"
            return NextResponse.redirect(url);
        } else {
            try {
                const { payload, protectedHeader } = await jwtVerify(jwt, secret)
                if (payload.role == "client") {
                    return NextResponse.next()
                } else {
                    request.cookies.set("token", "", { expires: new Date(Date.now()) });
                    url.pathname = "/auth/login"
                    return NextResponse.redirect(url);
                }
            } catch(e) {
                request.cookies.set("token", "", { expires: new Date(Date.now()) });
                url.pathname = "/auth/login"
                return NextResponse.redirect(url);
            }
        }
    }

    if(pathname.startsWith("/admin")) {
        if (jwt == undefined) {
            url.pathname = "/auth/admin"
            return NextResponse.redirect(url);
        } else {
            try {
                const { payload, protectedHeader } = await jwtVerify(jwt, secret)
                if (payload.role == "admin") {
                    return NextResponse.next()
                } else {
                    request.cookies.set("token", "", { expires: new Date(Date.now()) });
                    url.pathname = "/auth/admin"
                    return NextResponse.redirect(url);
                }
            } catch(e) {
                request.cookies.set("token", "", { expires: new Date(Date.now()) });
                url.pathname = "/auth/admin"
                return NextResponse.redirect(url);
            }
        }
    }
}
