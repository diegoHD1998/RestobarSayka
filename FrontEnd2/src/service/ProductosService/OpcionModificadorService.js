import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/OpcionModificadores`


export default class OpcionModificadorService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async create(opcion){
        return await axios.post(baseUrl,opcion).then(res => res)
        .catch(err => err.response)
    }

    async update(opcion){
        return await axios.put(`${baseUrl}/${opcion.idOpcionM}`, opcion).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}