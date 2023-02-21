import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Ventas`

export default class VentaService {

    /* async getVentas() {
        return await axios.get('/assets/demo/data/ventas.json').then(res => res.data.data)
        .catch(err => err.response)
    } */

    async create(venta) {
        return await axios.post(baseUrl,venta).then(res => res)
        .catch(err =>  err.response)
    }
    
}