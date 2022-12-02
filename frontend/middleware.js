// import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { verify } from "./services/verifyToken";

// verify token edge side
// async function verify (token, secret) {
//     const payload  = await jwtVerify(token, new TextEncoder().encode(secret));
//     return payload
// }

export async function middleware(req) {
    const secret = process.env.JWT_SECRET;
    const jwt = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // jwt = await verify(jwt).then(jwt => console.log(jwt))
    
    if (pathname.startsWith("/dashboard")) {
        if (jwt === undefined) {
            req.nextUrl.pathname = "/auth/login";
            return NextResponse.redirect(req.nextUrl);
        }
        // verify jwt
        try {
            await verify(jwt, secret);
            return NextResponse.next();
        } catch (error) {
            response.cookies.set("token", "", { expires: new Date(Date.now()) });
            req.nextUrl.pathname = "/auth/login";
            return NextResponse.redirect(req.nextUrl);
        }
    }

    if(jwt && pathname.startsWith("/auth")) {
        req.nextUrl.pathname = "/dashboard";
        return NextResponse.redirect(req.nextUrl);
    }

    return NextResponse.next()
}
