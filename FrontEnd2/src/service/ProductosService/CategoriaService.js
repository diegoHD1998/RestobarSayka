import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Categorias`


export default class CategoriaService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async readCategoriasActivas(){
        return await axios.get(`${baseUrl}/categoriasActivas`).then(res => res)
        .catch(err => err.response)
    }

    async create(categoria){
        return await axios.post(baseUrl,categoria).then(res => res)
        .catch(err => err.response)
    }

    async update(categoria){
        return await axios.put(`${baseUrl}/${categoria.idCategoria}`, categoria).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}