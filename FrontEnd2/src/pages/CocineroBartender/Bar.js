
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast';

import ProductoPedidoService from '../../service/PedidoService/ProductoPedidoService';
import StoredProcedureProductoPedido from '../../service/PedidoService/StoredProcedureProductoPedido';

const Bar = () => {
    
    const [productoPedidos, setProductoPedidos] = useState([])
    const toast = useRef(null);

    const productoPedidoService = new ProductoPedidoService();


    useEffect(() => {

        const storedProcedureProductoPedido = new StoredProcedureProductoPedido()

        setInterval(()=>{

            storedProcedureProductoPedido.GetSPBar().then( res => {
                if(res){
                    if(res.status >= 200 && res.status < 300){
                        setProductoPedidos(res.data)
                        console.log(res.data)
                    }else{
                        console.log('Error no controlado de storedProcedure Bar')
                        console.log(res.data)
                    }
                }
            })

        },10000)

    }, [])





    const ConfirmarRecepcion = async(id) => {

        await productoPedidoService.updateRecepcion(id).then( res => {
            if(res.status >= 200 && res.status < 300){
                setProductoPedidos(productoPedidos.filter((value) => value.idProductoPedido !== res.data))
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'ProductoPedido Recepcionado', life: 5000 });
            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                console.log(res.data)
            }else{
                console.log(res.data)
            }
        })


        

    }

    const horaBodyTemplate = (rowData) => {
        return `${rowData.hora.hours}:${rowData.hora.minutes}:${rowData.hora.seconds}`
    }

    
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-check" className="p-button-rounded p-button-info p-mr-2" onClick={() => ConfirmarRecepcion(rowData?.idProductoPedido)} />
            </div>
        );
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable value={productoPedidos} header="Bar" responsiveLayout="scroll">
                    <Column field='nombre' header="Nombre" />
                    <Column field='nombreReferencia' header='Referencia' />
                    <Column field='cantidad' header='Cantidad' />
                    <Column field='hora' header='Hora' body={horaBodyTemplate} />
                    <Column field='mesa' header='Mesa' />
                    <Column field='usuario' header='Usuario' />
                    <Column body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>
    );
};

export default Bar;