import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Impresoras`

export default class ImpresoraService {

    async imprimirPedidosMesa(id){
        return await axios.post(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

    async imprimirPreCuenta(cuenta){
        return await axios.post(`${baseUrl}/PreCuenta`, cuenta).then(res => res)
        .catch(err => err.response)
    }

    async readAll (){
        return await axios.get(baseUrl).then(res => res)
        .catch( err => err.response)
    }

    async create(impresora){
        return await axios.post(baseUrl,impresora).then(res => res)
        .catch(err => err.response)
    }

    async update(impresora){
        return await axios.put(`${baseUrl}/${impresora.idImpresora}`,impresora).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }
    

}