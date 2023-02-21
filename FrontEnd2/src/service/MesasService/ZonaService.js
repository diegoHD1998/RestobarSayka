import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Zonas`


export default class ZonaService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
        
    }

    async readZonasActivas(){
        return await axios.get(`${baseUrl}/zonasActivas`).then(res => res)
        .catch(err => err.response)
    }

    async create(zona){
        return await axios.post(baseUrl,zona).then(res => res)
        .catch(err => err.response)
    }

    async update(zona){
        return await axios.put(`${baseUrl}/${zona.idZona}`, zona).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}