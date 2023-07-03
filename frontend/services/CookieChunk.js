import { setCookie } from 'cookies-next';
import Cookies from 'js-cookie';

export function SetCookieChunk(cookiePrefix, token) {
    const chunkSize = 2048; // Set the desired chunk size
    const totalChunks = Math.ceil(token.length / chunkSize);

    const cookieChunks = [];

    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        const chunk = token.slice(start, end);
        cookieChunks.push(chunk);
    }

    cookieChunks.forEach((chunk, index) => {
        const cookieName = `${cookiePrefix}${index}`;
        Cookies.set(cookieName, chunk, { expires: 1 }); // Set the desired expiration for the cookie
        // console.log('Chunk', index, ':', chunk);
    });

    // console.log('Token split into cookie chunks:', cookieChunks);
}


export function GetCookieChunk(cookiePrefix) {
    const cookieChunks = [];
    let index = 0;
    let cookieName = `${cookiePrefix}${index}`;

    // Retrieve all the cookie chunks until no more chunks are found
    while (Cookies.get(cookieName)) {
        const chunk = Cookies.get(cookieName);
        cookieChunks.push(chunk);
        index++;
        cookieName = `${cookiePrefix}${index}`;
    }

    // Combine the cookie chunks into a single string
    const combinedToken = cookieChunks.join('');

    // console.log('Combined Token:', combinedToken);

    return combinedToken;
}

export function DeleteAllCookies() {
    const cookies = Cookies.get();

    for (const cookie in cookies) {
        Cookies.remove(cookie);
    }

    // console.log('All cookies deleted.');
}
