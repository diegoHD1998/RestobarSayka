import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Mesas`


export default class MesaService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async create(mesa){
        return await axios.post(baseUrl,mesa).then(res => res)
        .catch(err =>  err.response)
    }

    async update(mesa){
        return await axios.put(`${baseUrl}/${mesa.idMesa}`, mesa).then(res => res)
        .catch(err =>  err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err =>  err.response)
    }

    async readMesasDisponibles(){
        return await axios.get(`${baseUrl}/disponibles`).then(res => res)
        .catch(err => err.response)
    }

    async transferirMesa(transferencia){
        console.log('pase aqui 1')
        console.log(transferencia)
        return await axios.post(`${baseUrl}/TransferirMesa`, transferencia).then(res => {
            console.log('pase aqui 2')
            console.log(res)
            return res
        })
        .catch(err => err.response)
    }

}
