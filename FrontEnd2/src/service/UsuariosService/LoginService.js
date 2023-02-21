import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/Usuarios`

export default class LoginService {
    
    async loginAutenticate(user){
        return await axios.post(`${baseUrl}/login`,user).then(res => res)
        .catch(err => err.response)
    }


}