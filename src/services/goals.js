import axios from "axios"
const baseUrl = '/api/goals'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}


const getAll = async () => {
    const config = {
        headers: {Authorization: token}
    }
         
    const response = await axios.get(baseUrl, config)
    return response.data
}

const create = async ( newObj ) => {
    const config = {
        headers: {Authorization: token}
    }

    const response = await axios.post(baseUrl, newObj, config)
    return response.data
}

const remove = async ( id ) => {
    const config = {
        headers: {Authorization: token}
    }

    // console.log(config)

    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

const update = (id, obj) => {
    return axios.put(`${baseUrl}/${id}`, obj)
}


export default {
    getAll,
    create,
    setToken,
    remove,
    update
}