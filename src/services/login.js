import axios from 'axios'
// const baseUrl = "/api/login"
// const baseUrl = 'https://timewise-backend.vercel.app/api/login'
const baseUrl = 'http://34.217.73.248:3001/api/login'


const login = async (credentials) => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {login}