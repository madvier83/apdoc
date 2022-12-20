import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req) {
    // console.log(req)
    const { pathname } = req.nextUrl;

    const jwt = req.cookies.get("token")?.value;
    const secret = process.env.JWT_SECRET;

    if(pathname.startsWith("/auth")) {
        if (jwt == undefined) {
            return NextResponse.next()
        } else {
            try {
                const verified = await jwtVerify(jwt, new TextEncoder().encode(secret));
                if(verified) {
                    req.nextUrl.pathname = "/dashboard";
                    return NextResponse.redirect(req.nextUrl);
                }
            } catch(e) {
                req.cookies.set("token", "", { expires: new Date(Date.now()) });
                return NextResponse.next();
            }
        }
    }

    if(pathname.startsWith("/dashboard")) {
        if (jwt == undefined) {
            req.nextUrl.pathname = "/auth/login";
            return NextResponse.redirect(req.nextUrl);
        } else {
            try {
                const verified = await jwtVerify(jwt, new TextEncoder().encode(secret));
                if(verified) {
                    return NextResponse.next()
                }
            } catch(e) {
                req.cookies.set("token", "", { expires: new Date(Date.now()) });
                req.nextUrl.pathname = "/auth/login";
                return NextResponse.redirect(req.nextUrl);
            }
            
        }
    }

    // if(pathname.startsWith("/admin")) {
    //     if (jwt == undefined) {
    //         req.nextUrl.pathname = "/auth/login";
    //         return NextResponse.redirect(req.nextUrl);
    //     } else {
    //         const verified = await jwtVerify(jwt, new TextEncoder().encode(secret));
    //         if(verified) {
    //             return NextResponse.next()
    //         }
    //     }
    // }

    // if(!verified) {
    //     req.cookies.set("token", "", { expires: new Date(Date.now()) });
    //     req.nextUrl.pathname = "/auth/login";
    //     return NextResponse.redirect(req.nextUrl);
    // }
    
    // if(!jwt) {
    //     req.nextUrl.pathname = "/auth/login";
    //     return NextResponse.redirect(req.nextUrl);
    // }

    // try {
    //     jwtVerify(jwt, new TextEncoder().encode(secret));
        
    //     if(jwt && pathname.startsWith("/auth")) {
    //         req.nextUrl.pathname = "/dashboard";
    //         return NextResponse.redirect(req.nextUrl);
    //     }
        
    //     if (pathname.startsWith("/dashboard")) {

    //     }

    //     if (pathname.startsWith("/admin")) {
            
    //     }

    // } catch(err) {
    //     console.log(err)
    //     req.cookies.set("token", "", { expires: new Date(Date.now()) });
    //     req.nextUrl.pathname = "/auth/login";
    //     return NextResponse.redirect(req.nextUrl);
    // }

    // verify jwt
    // try {
        
    //     // if(pathname.startsWith("/auth")) {
    //     //     req.nextUrl.pathname = "/dashboard";
    //     //     return NextResponse.redirect(req.nextUrl);
    //     // }
        
    //     if (pathname.startsWith("/dashboard")) {

    //     }

    //     if (pathname.startsWith("/admin")) {
            
    //     }

    //     return NextResponse.next();

    // } catch (error) {
    //     req.cookies.set("token", "", { expires: new Date(Date.now()) });
    //     req.nextUrl.pathname = "/auth/login";
    //     return NextResponse.redirect(req.nextUrl);
    // }

    // jwt = await verify(jwt).then(jwt => console.log(jwt))
    
    // if(jwt && pathname.startsWith("/auth")) {
    //     req.nextUrl.pathname = "/dashboard";
    //     return NextResponse.redirect(req.nextUrl);
    // }
    
    // if (pathname.startsWith("/dashboard")) {
    //     if (jwt === undefined) {
    //         req.cookies.set("token", "", { expires: new Date(Date.now()) });
    //         req.nextUrl.pathname = "/auth/login";
    //         return NextResponse.redirect(req.nextUrl);
    //     }
    //     // verify jwt
    //     try {
    //         await verify(jwt, secret);
    //         return NextResponse.next();
    //     } catch (error) {
    //         req.cookies.set("token", "", { expires: new Date(Date.now()) });
    //         req.nextUrl.pathname = "/auth/login";
    //         return NextResponse.redirect(req.nextUrl);
    //     }
    // }
    // if (pathname.startsWith("/admin")) {
    //     if (jwt === undefined) {
    //         req.nextUrl.pathname = "/auth/login";
    //         return NextResponse.redirect(req.nextUrl);
    //     }
    //     // verify jwt
    //     try {
    //         await verify(jwt, secret);
    //         return NextResponse.next();
    //     } catch (error) {
    //         req.cookies.set("token", "", { expires: new Date(Date.now()) });
    //         req.nextUrl.pathname = "/auth/login";
    //         return NextResponse.redirect(req.nextUrl);
    //     }
    // }

    // console.log(reponse)
    // return NextResponse.next()
}
