import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Variantes`


export default class VarienteService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async create(variante){
        return await axios.post(baseUrl,variante).then(res => res)
        .catch(err => err.response)
    }

    async update(variante){
        return await axios.put(`${baseUrl}/${variante.idVariante}`, variante).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}