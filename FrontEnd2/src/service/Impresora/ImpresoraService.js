import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Impresoras`

export default class ImpresoraService {

    async imprimirPedidosMesa(id){
        return await axios.post(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }
}