import axios from 'axios'

export default axios.create({
    baseURL: 'http://localhost:8000/v1',
    // baseURL: 'http://207.148.126.140/v1'
})