import axios from 'axios'
const baseURL = '/api/persons'

const getAll = () => {
    let request = axios.get(baseURL)
    return request.then(response => response.data)
}

const create = newObj => {
    let request = axios.post(baseURL, newObj)
    return request.then(response => response.data)
}
const update = (id, newObject) => {
    const request = axios.put(`${baseURL}/${id}`, newObject)
    return request.then(response => response.data)
}
const _delete = id => {
    let remove = axios.delete(`${baseURL}/${id}`)
    return remove.then(response => response.data)
}
export default { create, getAll, update, delete: _delete }