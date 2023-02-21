import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Modificadores`


export default class ModificadorService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async create(modificador){
        return await axios.post(baseUrl,modificador).then(res => res)
        .catch(err => err.response)
    }

    async update(modificador){
        return await axios.put(`${baseUrl}/${modificador.idModificador}`, modificador).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}