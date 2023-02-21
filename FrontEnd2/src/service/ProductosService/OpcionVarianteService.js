import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/OpcionVariantes`


export default class OpcionVarienteService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async create(opcionVariante){
        return await axios.post(baseUrl, opcionVariante).then(res => res)
        .catch(err => err.response)
    }

    async update(opcionVariante){
        return await axios.put(`${baseUrl}/${opcionVariante.idOpcionV}`, opcionVariante).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

    async buscarOpciones(id){
        return await axios.get(`${baseUrl}/opcionesEspecificas/${id}`).then(res => res)
        .catch(err => err.response)
    }

}