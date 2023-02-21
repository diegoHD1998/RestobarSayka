import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ZonaService from '../../service/MesasService/ZonaService'
import MesaService from '../../service/MesasService/MesaService'

export default function Mesas ()  {

    let emptyProduct = {
        idMesa: null,
        nombre: 'Mesa ',
        zonaIdZona: null
    };

    const [mesas, setMesas] = useState(null); /* <----------------- */
    const [mesa, setMesa] = useState(emptyProduct);/* <----------------- */
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    
    const [zonas, setZonas] = useState([])

    const [loading, setloading] = useState(true)
    
    
    
    const mesaService = new MesaService(); 

    useEffect(() => {
        const zonaService = new ZonaService();
        zonaService.readZonasActivas().then(res => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setZonas(res.data) 
                    setloading(false)
                }else{
                    console.log('Error al cargar Datos de Zonas')
                }    
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo ')
            }
            
        });

        const mesaService = new MesaService();
        mesaService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setMesas(res.data)
                }else{
                    console.log('Error al cargar Datos de Mesas')
                }
            }else{
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setloading(false)
            }
            
            
        })

    }, []);


    const openNew = () => {
        setMesa(emptyProduct);
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

    const saveProduct = async() => { 
        setSubmitted(true);

        if (mesa.nombre.trim() && mesa.zonaIdZona!= null) {
            let _mesas = [...mesas];
            let _mesa = { ...mesa };

            if (mesa.idMesa) {
                await mesaService.update(mesa)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        const index = findIndexById(mesa.idMesa);
                        _mesas[index] = _mesa;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesa Actualizada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update de Mesa, Status no controlado`, life: 5000 });
                    }
                    

                })
            }
            else {
                delete _mesa.idMesa;
                await mesaService.create(_mesa)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        _mesas.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesa Creada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Mesa, Status No controlado`, life: 5000 });
                    }
                });
            }

            setMesas(_mesas);
            setProductDialog(false);
            setMesa(emptyProduct);
        }
    }

    const editProduct = (product) => {/* <----------------- */
        setMesa({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {/* <----------------- */
        setMesa(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async() => { 
        await mesaService.delete(mesa.idMesa)
        .then(res => {

            if(res.status >= 200 && res.status < 300){

                setMesas(mesas.filter(val => val.idMesa !== res.data))
                setDeleteProductDialog(false);
                setMesa(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Mesa Eliminada', life: 5000 });

            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Mesa, Status No controlado`, life: 5000 });
            }
        });
    }

    const findIndexById = (id) => {/* <----------------- */
        let index = -1;
        for (let i = 0; i < mesas.length; i++) {
            if (mesas[i].idMesa === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onInputChange = (e, name) => {/* <----------------- */
        const val = (e.target && e.target.value) || '';
        let _product = { ...mesa };
        _product[`${name}`] = val;

        setMesa(_product);
    }
    /* console.log(zonas) */
    const ColorBodytemplate = (rowData) => {

        if(zonas){

            let _zona = zonas.find(val => val?.idZona === rowData?.zonaIdZona)  // Aqui estan todos los datos de la zona 

            return (
                <>
                    
                    <div className={`cuadro1`} style={{background:`#${_zona?.color}`}}>
                        <span className={`texto1`}>{`${_zona?.nombre}`}</span>
                    </div>
                </>
            );
        }
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
            <h5 className="p-m-0"><b>Administracion de Mesas</b></h5>
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
                    <DataTable ref={dt} value={mesas}
                        dataKey="idMesa" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Zonas"
                        globalFilter={globalFilter} emptyMessage="Mesas No Encontradas." header={header} loading={loading}>
                        
                        <Column field="nombre" header="Nombre" sortable ></Column>
                        <Column field="zonaIdZona" header="Zona" body={ColorBodytemplate} sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px'}} header="Detalle Mesa " modal className="p-fluid " footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={mesa.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !mesa.nombre })} />
                            {submitted && !mesa.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                        <div className="p-field" style={{height:'200px'}}>
                            <label htmlFor="zonaIdZona">Zona</label>
                            <Dropdown id="zonaIdZona" optionLabel="nombre" optionValue="idZona" value={mesa.zonaIdZona} options={zonas} placeholder='Seleccione Zona' onChange={(e) => onInputChange(e, 'zonaIdZona')} required className={classNames({ 'p-invalid': submitted && !mesa.zonaIdZona })}rows={3} cols={20} />
                            {submitted && !mesa.zonaIdZona && <small className="p-invalid">Zona Requerida.</small>}
                            
                        </div>
                
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {mesa && <span>Estas seguro que quieres eliminar la mesa <b>{mesa.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}