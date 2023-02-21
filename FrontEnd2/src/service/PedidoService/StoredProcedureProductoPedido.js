import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/ProductoPedidos`

export default class StoredProcedureProductoPedido {

    async GetSPBar(){
        return await axios.get(`${baseUrl}/Bar`).then(res => res)
        .catch(err => err.response)
    }


    async GetSPCocina(){
        return await axios.get(`${baseUrl}/Cocina`).then(res => res)
        .catch(err => err.response)
    }

}