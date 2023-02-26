import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import ImpresoraService from '../../service/ImpresoraService/ImpresoraService'

export default function Impresoras ()  {

    let emptyImpresora = {
        idImpresora: null,
        ipImpresora: '',
        nombre: '',
    };

    const [impresoras, setImpresoras] = useState(null); 
    const [impresora, setImpresora] = useState(emptyImpresora);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setloading] = useState(true)
    const toast = useRef(null);
    const dt = useRef(null);
    
    const impresoraService = new ImpresoraService();

    useEffect(() => {
        const impresoraService = new ImpresoraService();
        impresoraService.readAll().then(res => {
            if(res){
                if(res.status >= 200 && res.status <300){
                    setImpresoras(res.data)
                    setloading(false)
                }else{
                    console.log('Error al Cargar los Datos de Impresoras')
                }
            }else{
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setloading(false)
            }
            
        });
    },[]);


    const openNew = () => {
        setImpresora(emptyImpresora);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const saveProduct = async() => { /* <----------------- */
        setSubmitted(true);

        if (impresora.nombre.trim() && impresora.ipImpresora.trim()) {
            let _Impresoras = [...impresoras];
            let _impresora = { ...impresora };

            if (impresora.idImpresora) {
                await impresoraService.update(impresora)
                .then(res => {

                    if(res.status >= 200 && res.status <300){

                        const index = findIndexById(impresora.idImpresora);
                        _Impresoras[index] = _impresora;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Impresora Actualizada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status < 500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update Impresora, Status No Controlado`, life: 5000 });
                    }
                    

                });
            }
            else {
                delete _impresora.idImpresora;
                await impresoraService.create(_impresora)
                .then(res => {
                    if(res.status >= 200 && res.status <300){

                        _Impresoras.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Impresora Creada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status < 500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Impresora, Status No Controlado`, life: 5000 });
                    }
                })
            }

            setImpresoras(_Impresoras);
            setProductDialog(false);
            setImpresora(emptyImpresora);
        }
    }

    const editProduct = (product) => {/* <----------------- */
        setImpresora({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {/* <----------------- */
        setImpresora(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async() => { // <------------------------
        await impresoraService.delete(impresora.idImpresora)
        .then(res => {
            if(res.status >= 200 && res.status <300){

                console.log(res.data)
                setImpresoras(impresoras.filter(val => val.idImpresora !== res.data))
                setDeleteProductDialog(false);
                setImpresora(emptyImpresora);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Impresora Eliminada', life: 5000 });
            }else if(res.status >= 400 && res.status < 500){
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Impresora, Status No Controlado`, life: 5000 });
            }

        })
    }

    const findIndexById = (id) => {/* <----------------- */
        let index = -1;
        for (let i = 0; i < impresoras.length; i++) {
            if (impresoras[i].idImpresora === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onInputChange = (e, name) => {/* <----------------- */
        const val = (e.target && e.target.value) || '';
        let _product = { ...impresora };
        _product[`${name}`] = val;

        setImpresora(_product);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    }

    const header = (/* <----------------- */
        <div className="table-header">
            <h5 className="p-m-0"><b>Administracion de Impresoras</b></h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    return (
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success p-button-rounded p-mb-3" onClick={openNew} />

                    <DataTable ref={dt} value={impresoras} className="datatable-responsive"
                        dataKey="idImpresora" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} 
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Impresoras"
                        globalFilter={globalFilter} emptyMessage="Impresoras No Encontradas." header={header} loading={loading}>
    
                        <Column field="nombre" header="Nombre" sortable ></Column>
                        <Column field="ipImpresora" header="IP Impresora" sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalle Impresora " modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={impresora.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !impresora.nombre })} />
                            {submitted && !impresora.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="ipImpresora">IP Impresora</label>
                            <InputText id="ipImpresora" value={impresora.ipImpresora} onChange={(e) => onInputChange(e, 'ipImpresora')} className={classNames({ 'p-invalid': submitted && !impresora.ipImpresora })} />
                            {submitted && !impresora.ipImpresora && <small className="p-invalid">IP Impresora Requerido.</small>}
                        </div>


                        

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {impresora && <span>Estas seguro que quieres eliminar la Impresora <b>{impresora.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}