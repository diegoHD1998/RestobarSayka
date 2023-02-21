import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Productos`


export default class ProductoService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async readProductosActivos(){
        return await axios.get(`${baseUrl}/productosActivos`).then(res => res)
        .catch(err => err.response)
    }

    async create(producto){
        return await axios.post(baseUrl,producto).then(res => res)
        .catch(err => err.response)
    }

    async update(producto){
        return await axios.put(`${baseUrl}/${producto.idProducto}`, producto).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}