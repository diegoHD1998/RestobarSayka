import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Usuarios`


export default class UsuarioService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async readAdmins(){
        return await axios.get(`${baseUrl}/Admin`).then(res => res)
        .catch(err => err.response)
    }

    async readMeseros(){
        return await axios.get(`${baseUrl}/Mesero`).then(res => res)
        .catch(err => err.response)
    }

    async readBartenders(){
        return await axios.get(`${baseUrl}/Bartender`).then(res => res)
        .catch(err => err.response)
    }

    async readCocineros(){
        return await axios.get(`${baseUrl}/Cocinero`).then(res => res)
        .catch(err => err.response)
    }


    

    async validarUserName(userName){
        return await axios.get(`${baseUrl}/validar/${userName}`).then(res => res)
        .catch(err => err.response)
    }

    async create(user){
        return await axios.post(baseUrl,user).then(res => res)
        .catch(err => err.response)
    }

    async update(user){
        return await axios.put(`${baseUrl}/${user.idUsuario}`, user).then(res => res)
        .catch(err => err.response)
    }

    async delete(id){
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}