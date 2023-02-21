import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/ProductoPedidos`

export default class ProductoPedidoService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async readOne(id){
        return await axios.get(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

    async readPPDPedido(id){
        return await axios.get(`${baseUrl}/DePedido/${id}`).then(res => res)
        .catch(err => err.response)
    }

    async create(productoPedido){
        return await axios.post(baseUrl,productoPedido).then(res => res)
        .catch(err => err.response)
    }

    async update(productoPedido){
        return await axios.put(`${baseUrl}/${productoPedido.idProductoPedido}`, productoPedido).then(res => res)
        .catch(err => err.response)
    }

    async updateRecepcion(id){
        return await axios.put(`${baseUrl}/recepcion/${id}`).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}