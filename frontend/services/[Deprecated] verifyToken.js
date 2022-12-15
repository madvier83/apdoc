import { jwtVerify } from 'jose'

export async function verify(token, secret) {
    const payload  = await jwtVerify(token, new TextEncoder().encode(secret));

    if (payload) {
        return true
    } else {
        return false
    }
}