import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Ventas`

export default class StoredProcedureVentas {

    async GetVentasSubTotales(fechas){
        return await axios.post(`${baseUrl}/spVentasSubTotales`,fechas).then(res => res)
        .catch(err =>  err.response)
    }

    async GetVentasTotales(fechas){
        return await axios.post(`${baseUrl}/spVentasTotales`,fechas).then(res => res)
        .catch(err =>  err.response)
    }

    async GetVentasProducto(fechas){
        return await axios.post(`${baseUrl}/spVentasProducto`,fechas).then(res => res)
        .catch(err =>  err.response)
    }

    async GetVentasProductoSpecific(fechas){
        return await axios.post(`${baseUrl}/spVentasProductoSpecific`,fechas).then(res => res)
        .catch(err =>  err.response)
    }

    async GetVentasEmpleados(fecha){
        return await axios.post(`${baseUrl}/spVentaEmpleados`,fecha).then(res => res)
        .catch(err =>  err.response)
    }

    async GetVentasDelDia(fecha){
        return await axios.post(`${baseUrl}/spVentasDelDia`,fecha).then(res => res)
        .catch(err =>  err.response)
    }
    


}