import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// import dotenv from "dotenv";

// dotenv.convig();

export async function middleware(req) {
    
    const { pathname } = req.nextUrl;
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/img')) {
        return NextResponse.next()
    }

    const url = req.nextUrl.clone()

    const jwt = req.cookies.get("token")?.value;
    const secret =  new TextEncoder().encode(process.env.JWT_SECRET);
    
    if(pathname == "/") {
        return NextResponse.next()
    }

    if(pathname.startsWith("/auth")) {
        if (!jwt) {
            return NextResponse.next();
        } else {
            try {
                const {payload} = await jwtVerify(jwt, secret);
                if(payload.role_id >= 2) {
                    url.pathname = "/dashboard";
                    return NextResponse.redirect(url);
                }
                if(payload.role_id == 1){
                    url.pathname = "/admin";
                    return NextResponse.redirect(url);
                }
            } catch(e) {
                req.cookies.set("token", "", { expires: new Date(Date.now()) });
                return NextResponse.next();
            }
        }
    }

    if(pathname.startsWith("/dashboard") || pathname === "/account" || pathname === "/settings") {
        if (jwt == undefined) {
            url.pathname = "/auth/login"
            return NextResponse.redirect(url);
        } else {
            try {
                const { payload } = await jwtVerify(jwt, secret)
                if(payload.role_id >= 2) {
                    return NextResponse.next()
                }else if(payload.role_id == 1) {
                    url.pathname = "/admin"
                    return NextResponse.redirect(url)
                }else{
                    return NextResponse.next()
                }
            } catch(e) {
                req.cookies.set("token", "", { expires: new Date(Date.now()) });
                url.pathname = "/auth/login"
                return NextResponse.redirect(url);
            }
        }
    }

    if(pathname.startsWith("/owner")) {
        if (jwt == undefined) {
            url.pathname = "/auth/login"
            return NextResponse.redirect(url);
        } else {
            try {
                const { payload } = await jwtVerify(jwt, secret)
                if(payload.role_id != 2) {
                    url.pathname = "/dashboard";
                    return NextResponse.redirect(url);
                }else{
                    return NextResponse.next()
                }
            } catch(e) {
                req.cookies.set("token", "", { expires: new Date(Date.now()) });
                url.pathname = "/auth/login"
                return NextResponse.redirect(url);
            }
        }
    }

    if(pathname.startsWith("/admin")) {
        if (jwt == undefined) {
            url.pathname = "/auth/login"
            return NextResponse.redirect(url);
        } else {
            try {
                const { payload } = await jwtVerify(jwt, secret)
                if(payload.role_id != 1) {
                    url.pathname = "/dashboard";
                    return NextResponse.redirect(url);
                }else{
                    return NextResponse.next()
                }
            } catch(e) {
                req.cookies.set("token", "", { expires: new Date(Date.now()) });
                url.pathname = "/auth/admin"
                return NextResponse.redirect(url);
            }
        }
    }

    // const dummyAccess = [
    //     {
    //     name: "admin",
    //     route: "/dashboard/admin",
    //     access: true,
    //     submenu: [
    //         { name: "user", route: "/dashboard/admin/user", access: true },
    //         { name: "position", route: "/dashboard/admin/position", access: true },
    //         { name: "access", route: "/dashboard/admin/access", access: true },
    //         { name: "employee", route: "/dashboard/admin/employee", access: true },
    //         { name: "service", route: "/dashboard/admin/service", access: true },
    //         { name: "diagnose", route: "/dashboard/admin/diagnose", access: true },
    //         {
    //         name: "category-payment",
    //         route: "/dashboard/admin/category-payment",
    //         access: true
    //         },
    //         { name: "payment", route: "/dashboard/admin/payment", access: true },
    //         {
    //         name: "category-outcome",
    //         route: "/dashboard/admin/category-outcome",
    //         access: true
    //         },
    //         { name: "outcome", route: "/dashboard/admin/outcome", access: true },
    //         {
    //         name: "promotion",
    //         route: "/dashboard/admin/promotion",
    //         access: true,
    //         },
    //     ],
    //     },
    //     {
    //     name: "receptionist",
    //     route: "/dashboard/receptionist",
    //     access: true,
    //     submenu: [
    //         {
    //         name: "patient",
    //         route: "/dashboard/receptionist/patient",
    //         access: true,
    //         },
    //         {
    //         name: "appointment",
    //         route: "/dashboard/receptionist/appointment",
    //         access: true,
    //         },
    //         { name: "queue", route: "/dashboard/receptionist/queue", access: true },
    //     ],
    //     },
    //     {
    //     name: "doctor",
    //     route: "/dashboard/doctor",
    //     access: true,
    //     submenu: [
    //         { name: "patient", route: "/dashboard/doctor/patient", access: true },
    //         { name: "queue", route: "/dashboard/doctor/queue", access: true },
    //     ],
    //     },
    //     {
    //     name: "pharmacy",
    //     route: "/dashboard/pharmacy",
    //     access: true,
    //     submenu: [
    //         {
    //         name: "category-item",
    //         route: "/dashboard/pharmacy/category-item",
    //         access: true,
    //         },
    //         { name: "item", route: "/dashboard/pharmacy/item", access: true },
    //         {
    //         name: "item-supply",
    //         route: "/dashboard/pharmacy/supply",
    //         access: true,
    //         },
    //         {
    //         name: "stock-adjustment",
    //         route: "/dashboard/pharmacy/stock-adjustment",
    //         access: true,
    //         },
    //     ],
    //     },
    //     {
    //     name: "cashier",
    //     route: "/dashboard/cashier",
    //     access: true,
    //     submenu: [
    //         {
    //         name: "transaction",
    //         route: "/dashboard/cashier/transaction",
    //         access: true,
    //         },
    //         { name: "history", route: "/dashboard/cashier/history", access: true },
    //     ],
    //     },
    //     {
    //     name: "report",
    //     route: "/dashboard/report",
    //     access: true,
    //     submenu: [
    //         { name: "sales", route: "/dashboard/report/sales", access: true },
    //         {
    //         name: "commision",
    //         route: "/dashboard/report/commision",
    //         access: true,
    //         },
    //     ],
    //     },
    // ];

    // console.log("=== NEXT =====================================================================")
    // console.log("pathname : " + pathname)

    let isRouteAllowed = false;
    if (jwt == undefined) {
        url.pathname = "/auth/login"
        return NextResponse.redirect(url);
    } else {
        try {
            const { payload } = await jwtVerify(jwt, secret)
            let access = JSON.parse(payload.accesses)
            // console.log(JSON.parse(payload.accesses))
            access.map(menu => {
                // console.log(menu.route + ": " + (pathname.startsWith(menu.route) && menu.access))
                if(pathname.startsWith(menu.route) && menu.access) { 
                    menu.submenu.map(submenu => {
                        // console.log(submenu.route + ": " + (pathname.startsWith(submenu.route) && submenu.access))
                        if(pathname.startsWith(submenu.route) && submenu.access) {
                            isRouteAllowed = true
                        }
                    })
                }
            })
            // console.log("isRouteAllowed" + isRouteAllowed)
            // console.log("Done")
        } catch(e) {
            req.cookies.set("token", "", { expires: new Date(Date.now()) });
            url.pathname = "/auth/login"
            return NextResponse.redirect(url);
        }
    }
    
    // if(isRouteAllowed == false) {
    //     return NextResponse.rewrite(
    //         `${process.env.BASE_URL}403`,
    //         {
    //             status: 403,
    //             headers: {
    //                 "WWW-Authenticate": 'Basic realm="Secure Area"',
    //             },
    //         }
    //     );
    // }

    if(isRouteAllowed == false) {
        url.pathname = "/dashboard"
        return NextResponse.redirect(url);
    }
}

export const config = { matcher: "/((?!.*\\.).*)" };
