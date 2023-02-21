import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Roles`


export default class RolService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async create(rol){
        return await axios.post(baseUrl,rol).then(res => res)
        .catch(err => err.response)
    }

    async update(rol){
        return await axios.put(`${baseUrl}/${rol.idRol}`, rol).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}