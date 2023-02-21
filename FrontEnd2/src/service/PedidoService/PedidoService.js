import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Pedidos`

export default class PedidoService {

    async readOne(idMesa){
        return await axios.get(`${baseUrl}/${idMesa}`).then(res => res)
        .catch(err => err.response)
    }

    async create(pedido){
        return await axios.post(baseUrl,pedido).then(res => res)
        .catch(err => err.response)
    }

    async update(pedido){
        return await axios.put(`${baseUrl}/${pedido.idPedido}`, pedido).then(res => res)
        .catch(err =>  err.response)
    }

    /* async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err =>  err.response)
    } */
}

