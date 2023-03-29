import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
    
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/img')) {
        return NextResponse.next()
    }

    const url = request.nextUrl.clone()

    const jwt = request.cookies.get("token")?.value;
    const secret =  new TextEncoder().encode(process.env.JWT_SECRET);

    // console.log(pathname.startsWith("/auth"))
    // console.log(!jwt)
    // console.log(jwt)

    if(pathname.startsWith("/auth")) {
        if (!jwt) return NextResponse.next();
        try {
            const {payload} = await jwtVerify(jwt, secret);
            if(payload.role_id == 2) {
                url.pathname = "/dashboard";
                return NextResponse.redirect(url);
            }
            if(payload.role_id == 1){
                url.pathname = "/admin";
                return NextResponse.redirect(url);
            }
        } catch(e) {
            request.cookies.set("token", "", { expires: new Date(Date.now()) });
            return NextResponse.next();
        }
    }

    if(pathname.startsWith("/dashboard")) {
        if (jwt == undefined) {
            url.pathname = "/auth/login"
            return NextResponse.redirect(url);
        } else {
            try {
                const { payload } = await jwtVerify(jwt, secret)
                if (payload.role_id == 2) {
                    url.pathname = "/dashboard"
                    return NextResponse.next()
                }
                if (payload.role_id == 1) {
                    url.pathname = "/admin"
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
                const { payload } = await jwtVerify(jwt, secret)
                if (payload.role_id == 1) {
                    url.pathname = "/admin"
                    return NextResponse.next()
                }
                if (payload.role_id == 2) {
                    url.pathname = "/dashboard"
                    return NextResponse.redirect(url);
                }
            } catch(e) {
                request.cookies.set("token", "", { expires: new Date(Date.now()) });
                url.pathname = "/auth/admin"
                return NextResponse.redirect(url);
            }
        }
    }

    // if(pathname.startsWith("/auth")) {
    //     if (jwt === undefined) {
    //         return NextResponse.next()
    //     } else {
    //         try {
    //             const payload = await jwtVerify(jwt, secret);
    //             if(payload) {
    //                 if(payload.role_id == 2) {
    //                     url.pathname = "/dashboard";
    //                     return NextResponse.redirect(url);
    //                 }
    //                 if(payload.role_id == 1){
    //                     url.pathname = "/admin";
    //                     return NextResponse.redirect(url);
    //                 }
    //             }
    //         } catch(e) {
    //             request.cookies.set("token", "", { expires: new Date(Date.now()) });
    //             return NextResponse.next();
    //         }
    //     }
    // }
}
