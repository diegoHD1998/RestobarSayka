import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import RolService from '../../service/UsuariosService/RolService'

export default function Roles ()  {

    const [roles, setRoles] = useState(null);
    
    const [loading, setloading] = useState(true)
    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        const rolService = new RolService();
        rolService.readAll().then(res =>{
            if(res){
                if(res.status >= 200 && res.status <300){
                    setRoles(res.data)
                    setloading(false)
                }else{
                    console.log('Error al Cargar Datos de Roles')
                }
            }else{
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setloading(false)
            }
            
        });
    },[]);

    const header = (/* <----------------- */
        <div className="table-header">
            <h5 className="p-m-0"><b>Roles en el sistema</b></h5>
        </div>
    );

    

    return (
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <DataTable ref={dt} value={roles} 
                        dataKey="idRol" className="datatable-responsive" emptyMessage="Roles No Encontrados." header={header} loading={loading}>
                            
                        <Column field="nombre" header="Roles" ></Column>

                    </DataTable>

                </div>
            </div>
        </div>
    );
}