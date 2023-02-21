import React,{useState,useContext, useRef} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './auth/authContext';
import { Toast } from 'primereact/toast';
import { types } from './types/types';
import LoginService from './service/UsuariosService/LoginService';
import md5 from 'md5'
import './layout/sass/EstilosPropios/login.scss'


const Login = () => {

	let emptyUsuario = {
		userName:'',
		password:''
	}
	const [usuario, setUsuario] = useState(emptyUsuario)
	const [submitted, setSubmitted] = useState(false);
	const [loading1, setLoading] = useState(false)
	const {dispatch} = useContext(AuthContext)
	const history = useHistory();
	const toast = useRef(null);

	const loginService = new LoginService()


	const onLoadingClick1 = () => {
        setLoading(true);
		
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    }

	const AutenticateUser = async () => {
		setSubmitted(true);
		if(usuario.userName.trim() && usuario.password.trim()){

			let _usuario = {...usuario}
			_usuario.password = md5(usuario.password)

			onLoadingClick1()

			await loginService.loginAutenticate(_usuario).then(res => {
				if(res.status >= 200 && res.status<300){

					dispatch({
						type:types.login,
						payload:res.data
					})
					history.replace('/')

				}else if(res.status >= 400 && res.status<500){
					console.log(`Usuario No Autorizado ${res.data}`)
					toast.current.show({severity:'error', summary: 'Inicio de Sesion Fallida', detail: res.data, life: 8000});
				}else{
					console.log('Error, status No controlado en Login')
					toast.current.show({severity:'error', summary: 'Error Message', detail:'Status de respuesta de Login No Controlado', life: 6000});
				}
			})

			setUsuario(emptyUsuario)
			

		}
	}


	const onInputChange = (e, name) => {/* <----------------- */
        const val = (e.target && e.target.value) || '';
        let _user = { ...usuario };
        _user[`${name}`] = val;
        setUsuario(_user);
    }

	return (
		<div className="login-body">
			<Toast ref={toast} />
			<div className="login-wrapper">
				<div className="login-panel">
					<button onClick={() => history.push('/')} className="logo p-link">
						<img src="/assets/layout/images/LOGO-SAYKA.svg" alt="freya-layout" />
					</button>
					
					<div className="userName p-mb-4">
						<span className='p-float-label cajaSpan'>
							<InputText id="userName" value={usuario.userName} required autoFocus  onChange={(e)=>onInputChange(e,'userName')}  className={`p-inputtext ${submitted && !usuario.userName && 'p-invalid'}`} />  {/* 'p-inputtext p-mr-2', */}
							<label htmlFor="userName">Username</label>
						</span>
							{submitted && !usuario.userName && <small className="p-error" style={{position:'relative', left:'-65px'}}>UserName Requerido*</small>}
					</div>

					<div className=" p-mb-4">
						<span className='p-float-label' >
							<Password  id="password" value={usuario.password} onChange={(e)=>onInputChange(e,'password')}  feedback={false} className={`${submitted && !usuario.password && 'p-invalid'}`}/>
							<label htmlFor="password">Contraseña</label>
						</span>
						{submitted && !usuario.password && <small className="p-error" style={{position:'relative', left:'-65px'}}>Contraseña Requerida*</small>}
					</div>

					<Button className='botonLogin' label={!loading1 ? 'Ingresar' : `Ingresando...` } type="button" onClick={AutenticateUser} ></Button>

				</div>
				<div className="login-footer">
					<h4>Sayka</h4>
					<h6>Copyright Ⓒ Cerveceria Artesanal Sayka</h6>
				</div>
			</div>
		</div >
	)
}

export default Login;



