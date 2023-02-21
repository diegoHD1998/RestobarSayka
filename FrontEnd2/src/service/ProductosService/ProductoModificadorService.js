import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/ProductoModificadores`


export default class ProductoModificadorService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }
    async create(ProductoModificador){
        return await axios.post(baseUrl, ProductoModificador).then(res => res)
        .catch(err => err.response)
    }
    async delete(idProducto, idModificador){
        return await axios.delete(`${baseUrl}/${idProducto}/${idModificador}`)
        .catch(err => err.response)
    }

    async pmExistente(id){
        return await axios.get(`${baseUrl}/pm-existentes/${id}`).then(res => res)
        .catch(err => err.response)
    }

}