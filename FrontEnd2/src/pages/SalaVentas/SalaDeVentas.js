import React, {useState,useEffect, useRef} from 'react';
import Mesa2 from '../../components/Mesa2';
import Loading from '../../components/Loading'
import MesaService from '../../service/MesasService/MesaService'
import { Link} from 'react-router-dom';
import { Toast } from 'primereact/toast';

const SalaDeVentas = () => {
    const toast = useRef(null);
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState(false)

    useEffect(()=>{
        const mesaService = new MesaService();
        mesaService.readAll().then((res) => {
            
            if(res){
                if(res.status >= 200 && res.status<300){
                    setMesas(res.data);
                    setLoading(false);
                }else{
                    console.log('Error al cargar Datos de Mesas');
                }
            }else{

                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setLoading(false)
                setError(true)

            }

        })

    },[]);

    if(loading === true){
        return(
            <div className='p-grid p-d-flex p-jc-center p-ai-center' style ={{height: '65vh'}} >
                <Toast ref={toast} />
                <Loading/>
            </div>
        )

    }else if(error === true){

        return (
            <div className='p-grid p-d-flex p-mx-auto'>
                <Toast ref={toast} />
                <div className='p-d-flex p-jc-center p-ai-center'> 
                    <div className='p-d-flex'>
                        <h1>Mesas No Disponibles</h1>
                    </div>
                </div>
            </div>
        );
        
    }else{
        return (
            <div className='p-grid p-d-flex '>
                <Toast ref={toast} />
                
                {mesas.map(mesa =>
                    <div key={mesa.idMesa} className='p-col-4 p-lg-2 p-md-3 p-sm-4 p-d-flex p-jc-center p-my-1' /* onClick={() => history.push('/home/experimento')} */ > 
                        <Link to={`/pedido/${mesa.idMesa}/${mesa.nombre}/${mesa.disponibilidad}/${mesa.zonaIdZona}`}>
                            <Mesa2 nombre={mesa.nombre} disponibilidad={mesa.disponibilidad}/>
                        </Link>
                    </div>
                )}
                
            </div>
        );
    }
    
};

export default SalaDeVentas;