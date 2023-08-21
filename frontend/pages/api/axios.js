import axios from 'axios'

export default axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/v1`,
    // baseURL: 'http://207.148.126.140/v1',
})