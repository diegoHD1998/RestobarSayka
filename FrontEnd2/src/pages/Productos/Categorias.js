import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import CategoriaService from '../../service/ProductosService/CategoriaService'
import {estados,tiposCategoria} from '../../service/Variables'

export default function Categorias ()  {

    let emptyProduct = {
        idCategoria: null,
        nombre: '',
        descripcion: '',
        color:'',
        estado:estados[0],
        tipo:''

    };

    const [categorias, setCategorias] = useState(null); 
    const [categoria, setCategoria] = useState(emptyProduct);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setloading] = useState(true)
    const toast = useRef(null);
    const dt = useRef(null);
    
    const categoriaService = new CategoriaService();

    useEffect(() => {
        const categoriaService = new CategoriaService();
        categoriaService.readAll().then(res => {
            if(res){
                if(res.status >= 200 && res.status <300){
                    setCategorias(res.data)
                    setloading(false)
                }else{
                    console.log('Error al Cargar los Datos de Categoria')
                }
            }else{
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setloading(false)
            }
            
        });
    },[]);


    const openNew = () => {
        setCategoria(emptyProduct);
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

        if (categoria.nombre.trim() && categoria.estado.trim() && categoria.tipo.trim() && categoria.color !== '') {
            let _categorias = [...categorias];
            let _categoria = { ...categoria };

            if (categoria.idCategoria) {
                await categoriaService.update(categoria)
                .then(res => {

                    if(res.status >= 200 && res.status <300){

                        const index = findIndexById(categoria.idCategoria);
                        _categorias[index] = _categoria;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categoria Actualizada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status < 500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update Categoria, Status No Controlado`, life: 5000 });
                    }
                    

                });
            }
            else {
                delete _categoria.idCategoria;
                await categoriaService.create(_categoria)
                .then(res => {
                    if(res.status >= 200 && res.status <300){

                        _categorias.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categoria Creada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status < 500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Categoria, Status No Controlado`, life: 5000 });
                    }
                })
            }

            setCategorias(_categorias);
            setProductDialog(false);
            setCategoria(emptyProduct);
        }
    }

    const editProduct = (product) => {/* <----------------- */
        setCategoria({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {/* <----------------- */
        setCategoria(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async() => { // <------------------------
        await categoriaService.delete(categoria.idCategoria)
        .then(res => {
            if(res.status >= 200 && res.status <300){

                console.log(res.data)
                setCategorias(categorias.filter(val => val.idCategoria !== res.data))
                setDeleteProductDialog(false);
                setCategoria(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Categoria Eliminada', life: 5000 });
            }else if(res.status >= 400 && res.status < 500){
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Categoria, Status No Controlado`, life: 5000 });
            }

        })
    }

    const findIndexById = (id) => {/* <----------------- */
        let index = -1;
        for (let i = 0; i < categorias.length; i++) {
            if (categorias[i].idCategoria === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onInputChange = (e, name) => {/* <----------------- */
        const val = (e.target && e.target.value) || '';
        let _product = { ...categoria };
        _product[`${name}`] = val;

        setCategoria(_product);
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

    /* const statusBodyTemplate2 = (rowData) => {
        return <span className={`product-badge-1 status-opcionV`}>{rowData.tipo}</span>;
    } */

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
            <h5 className="p-m-0"><b>Administracion de Categorias</b></h5>
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

                    <DataTable ref={dt} value={categorias} className="datatable-responsive"
                        dataKey="idCategoria" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} 
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Categorias"
                        globalFilter={globalFilter} emptyMessage="Categorias No Encontradas." header={header} loading={loading}>
    
                        <Column field="nombre" header="Nombre" sortable ></Column>
                        <Column field="descripcion" header="Descripción" sortable ></Column>
                        <Column field="color" header="Color" body={ColorBodytemplate} sortable ></Column>
                        <Column field="estado" header="Estado" body={statusBodyTemplate} sortable ></Column>
                        <Column field="tipo" header="Tipo de Categoria" /* body={statusBodyTemplate2} */ sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalle Categoria " modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={categoria.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !categoria.nombre })} />
                            {submitted && !categoria.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="descripcion">Descripcion</label>
                            <InputTextarea id="descripcion" value={categoria.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} />
                            
                        </div>


                        <div className="p-field">
                            <label htmlFor="estado">Estado</label>
                            <Dropdown id="estado" value={categoria.estado} options={estados} placeholder='Seleccione estado' onChange={(e) => onInputChange(e, 'estado')} required className={classNames({ 'p-invalid': submitted && !categoria.estado })}rows={3} cols={20} />
                            {submitted && !categoria.estado && <small className="p-invalid">Estado Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="tipo">Tipo de Categoria</label>
                            <Dropdown id="tipo" value={categoria.tipo} options={tiposCategoria} placeholder='Seleccione Tipo categoria' onChange={(e) => onInputChange(e, 'tipo')} required className={classNames({ 'p-invalid': submitted && !categoria.tipo })}rows={3} cols={20} />
                            {submitted && !categoria.tipo && <small className="p-invalid">Tipo de Categoria Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <h6>Color</h6>
                            <ColorPicker id="color" style={{width:'30px'}} value={categoria.color} defaultColor={`#56EBEE`} onChange={(e) => onInputChange(e, 'color')} className={classNames({ 'p-invalid': submitted && !categoria.color })} ></ColorPicker>
                            {submitted && !categoria.color && <small className="p-invalid" style={{color:'red'}}>Color Requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {categoria && <span>Estas seguro que quieres eliminar la categoria <b>{categoria.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}
