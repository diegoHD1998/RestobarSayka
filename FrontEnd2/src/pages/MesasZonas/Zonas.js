import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import ZonaService from '../../service/MesasService/ZonaService'
import {estados} from '../../service/Variables'

export default function Zonas ()  {

    let emptyProduct = {
        idZona: null,
        nombre: '',
        color:'',
        estado:estados[0]
    };

    const [zonas, setZonas] = useState(null); /* <----------------- */
    const [zona, setZona] = useState(emptyProduct);/* <----------------- */
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [loading, setloading] = useState(true)
    const zonaService = new ZonaService();/* <----------------- */

    useEffect(() => {
        const zonaService = new ZonaService();
        zonaService.readAll().then(res =>{
            if(res){

                if(res.status >= 200 && res.status<300){
                    setZonas(res.data)
                    setloading(false)
                }else{
                    console.log('Error al Cargar Datos de Zonas')
                }
            }else{
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setloading(false)
            }
        });
    }, []);


    const openNew = () => {
        setZona(emptyProduct);
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

        if (zona.nombre.trim() && zona.estado !== '' && zona.color !== '') {
            let _zonas = [...zonas];
            let _zona = { ...zona };

            if (zona.idZona) {
                await zonaService.update(zona)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        const index = findIndexById(zona.idZona);
                        _zonas[index] = _zona;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Zona Actualizada', life: 5000 });
                        console.log(res.data);

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Zona No Actualizada: ${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update Zona, Status No controlado`, life: 5000 });
                    }
                    

                })
            }
            else {
                delete _zona.idZona;
                await zonaService.create(_zona)
                .then(res => {
                    if(res.status >= 200 && res.status<300){
                        _zonas.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Zona Creada', life: 5000 });
                        console.log(res.data)
                    } else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Zona, Status No controlado`, life: 5000 });
                    }
                    
                });
            }

            setZonas(_zonas);
            setProductDialog(false);
            setZona(emptyProduct);
        }
    }

    const editProduct = (product) => {/* <----------------- */
        setZona({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {/* <----------------- */
        setZona(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async() => { // <------------------------
        await zonaService.delete(zona.idZona)
        .then(res => {
            if(res.status >= 200 && res.status<300){

                console.log(res.data)
                setZonas(zonas.filter(val => val.idZona !== res.data))
                setDeleteProductDialog(false);
                setZona(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Zona Eliminada', life: 5000 });

            }else if(res.status >= 400 && res.status<500){
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Zona, Status No controlado`, life: 5000 });
            }            
        });
        
    }

    const findIndexById = (id) => {/* <----------------- */
        let index = -1;
        for (let i = 0; i < zonas.length; i++) {
            if (zonas[i].idZona === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onInputChange = (e, name) => {/* <----------------- */
        const val = (e.target && e.target.value) || '';
        let _product = { ...zona };
        _product[`${name}`] = val;

        setZona(_product);
    }

    const ColorBodytemplate = (rowData) => {
        return (
            <>
                <div className={`cuadro`} style={{background:`#${rowData.color}`}}></div>
            </>
        );
    }
    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge-1 status-${rowData.estado.toLowerCase()}`}>{rowData.estado}</span>;
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
            <h5 className="p-m-0"><b>Administracion de Zonas</b></h5>
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

                    <DataTable ref={dt} value={zonas} 
                        dataKey="idZona" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Zonas"
                        globalFilter={globalFilter} emptyMessage="Zonas No Encontradas." header={header} loading={loading}>
                        
                        <Column field="nombre" header="Nombre" sortable ></Column>
                        <Column field="color" header="Color" body={ColorBodytemplate} sortable ></Column>
                        <Column field="estado" header="Estado" body={statusBodyTemplate} sortable ></Column>
                        
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px'}} header="Detalle Zona " modal className="p-fluid " footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field" /* style={{height:'120px'}} */>
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={zona.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !zona.nombre })} />
                            {submitted && !zona.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <h6>Color</h6>
                            <ColorPicker id="color" style={{width:'30px' }} value={zona.color} defaultColor={`#56EBEE`} onChange={(e) => onInputChange(e, 'color')} className={classNames({ 'p-invalid': submitted && !zona.color })}  ></ColorPicker>
                            {submitted && !zona.color && <small style={{color:'red'}} className="p-invalid"> Color Requerido.</small>}
                        </div>
                        <div className="p-field" style={{height:'120px'}}>
                            <label htmlFor="estado">Estado</label>
                            <Dropdown id="estado" value={zona.estado} options={estados} placeholder='Seleccione estado' onChange={(e) => onInputChange(e, 'estado')} required className={classNames({ 'p-invalid': submitted && !zona.estado })}rows={3} cols={20} />
                            {submitted && !zona.estado && <small className="p-invalid">Estado Requerido.</small>}
                        </div>
                
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {zona && <span>Estas seguro que quieres eliminar la zona <b>{zona.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}
