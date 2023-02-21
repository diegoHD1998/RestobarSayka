import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import ModificadorService from '../../service/ProductosService/ModificadorService'
import OpcionModificadorService from '../../service/ProductosService/OpcionModificadorService'
import { numOrden } from '../../service/Variables';




export default function Modificadores ()  {

    let emptyProduct = {
        idModificador: null,
        nombre: ''
    };

    let emptyOpcionModificador = {
        idOpcionM: null,
        nombre: '',
        precio: null,
        orden: null,
        modificadorIdModificador: null
    }

    const [modificadores, setModificadores] = useState(null);
    const [modificador, setModificador] = useState(emptyProduct);

    const [opcionModificadores, setOpcionModificadores] = useState(null); 
    const [opcionModificador, setOpcionModificador] = useState(emptyOpcionModificador);
    const [opciones, setOpciones] = useState([]) 

    const [opcionDialog, setOpcionDialog] = useState(false);
    const [submitted2, setSubmitted2] = useState(false);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteOpcionDialog, setDeleteOpcionDialog] = useState(false)
    
    const [loading, setloading] = useState(true)
    
    const modificadorService = new ModificadorService(); 
    const opcionModificadorService = new OpcionModificadorService()
    
    useEffect(() => {

        const modificadorService = new ModificadorService();
        modificadorService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setModificadores(res.data)
                    setloading(false)
                }else{
                    console.log('Error al cargar Datos de Modificador')
                }
            }else{
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setloading(false)
            }
            
        });
        

        const opcionModificadorService = new OpcionModificadorService();
        opcionModificadorService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setOpcionModificadores(res.data)
                }else{
                    console.log('Error al cargar Datos de OpcionModificador')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo')
            }
        });
        
        
    }, []);
    
    const abrirOpciones = (rowData) =>{
        setModificador(rowData)
        setOpciones(EncontrarOpciones(rowData))
        setDialogVisible(true)
    }
    
    const ocultarDialog = () =>{
        setDialogVisible(false)
        setModificador(emptyProduct)
        setOpciones(null)
    }

    const openNew = () => {
        setModificador(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }
    
    const openNewOpcion = (data) => {

        setOpcionModificador(emptyOpcionModificador);
        setOpcionModificador({modificadorIdModificador: data.idModificador})
        setSubmitted2(false);
        setOpcionDialog(true);
        
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }
    
    const hideDialogOpcion = () => {
        setSubmitted2(false);
        setOpcionDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteOpcionDialog = () => {
        setDeleteOpcionDialog(false)
    }

    const saveProduct = async() => { 
        setSubmitted(true);

        if (modificador.nombre.trim()) {
            let _modificadores = [...modificadores];
            let _modificador = { ...modificador };

            if (modificador.idModificador) {
                await modificadorService.update(modificador)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        const index = findIndexById(modificador.idModificador);
                        _modificadores[index] = _modificador;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Modificador Actualizado', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update de Modificador, Status no controlado`, life: 5000 });
                    }
                    

                })
            }
            else {
                delete _modificador.idModificador;
                await modificadorService.create(_modificador)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        _modificadores.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Modificador Creado', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Modificador, Status No controlado`, life: 5000 });
                    }
                });
            }

            setModificadores(_modificadores);
            setProductDialog(false);
            setModificador(emptyProduct);
        }
    }
    
    const saveOpcionModificador = async() => { 
        setSubmitted2(true);

        if (opcionModificador.nombre && opcionModificador.precio >=0) {
            let _OpcionModificadores = [...opcionModificadores];
            let _OpcionModificador = { ...opcionModificador };
            
            if(opcionModificador.idOpcionM){
                await opcionModificadorService.update(opcionModificador)
                .then(res => {
                    if(res.status >= 200 && res.status<300){
                        const index = findIndexById2(opcionModificador.idOpcionM);
                        _OpcionModificadores[index] = _OpcionModificador;
                        
                        let _Opciones = [...opciones]
                        const index2 = findIndexById3(opcionModificador.idOpcionM);
                        _Opciones[index2] = _OpcionModificador
                        setOpciones(_Opciones)

                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Opcion Modificador Actualizado', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update de Opcion Modificador, Status no controlado`, life: 5000 });
                    }
                });
            }else{

                delete _OpcionModificador.idOpcionM;
                await opcionModificadorService.create(_OpcionModificador)
                .then(res => {
                    if(res.status >= 200 && res.status < 300){
                        _OpcionModificadores.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Opcion Modificador Creado', life: 5000 });
                        console.log(res.data)
                    }else if(res.status >= 400 && res.status < 500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Opcion Modificador, Status No controlado`, life: 5000 });
                    }
                });
            }
            
            setOpcionModificadores(_OpcionModificadores);
            setOpcionDialog(false);
            setOpcionModificador(emptyOpcionModificador);
            
        }
    }

    const editProduct = (product) => {
        setModificador({ ...product });
        setProductDialog(true);
    }
    const editOpcion = (opcion) => {
        setOpcionModificador({...opcion});
        setOpcionDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setModificador(product);
        setDeleteProductDialog(true);
    }

    const confirmDeleteOpcion = (opcion) => {
        setOpcionModificador(opcion)
        setDeleteOpcionDialog(true)
    }

    const deleteProduct = async() => { 
        await modificadorService.delete(modificador.idModificador)
        .then(res => {

            if(res.status >= 200 && res.status < 300){
                setModificadores(modificadores.filter(val => val.idModificador !== res.data))
                setDeleteProductDialog(false);
                setModificador(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Modificador Eliminado', life: 5000 });

            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Modificador, Status No controlado`, life: 5000 });
            }
        });
    }

    const deleteOpcion = async() => { 
        await opcionModificadorService.delete(opcionModificador.idOpcionM)
        .then(res => {

            if(res.status >= 200 && res.status < 300){

                setOpcionModificadores(opcionModificadores.filter(val => val.idOpcionM !== res.data));
                setOpciones(opciones.filter(val => val.idOpcionM !== res.data));
                setDeleteOpcionDialog(false);
                setOpcionModificador(emptyOpcionModificador);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Opcion Modificador Eliminado', life: 5000 });
                
            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Opcion Modificador, Status No controlado`, life: 5000 });
            }
        });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < modificadores.length; i++) {
            if (modificadores[i].idModificador === id) {
                index = i;
                break;
            }
        }

        return index;
    };
    
    
    const findIndexById2 = (id) => {
        let index = -1;
        for (let i = 0; i < opcionModificadores.length; i++) {
            if (opcionModificadores[i].idOpcionM === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexById3 = (id) => { 
        let index = -1;
        for (let i = 0; i < opciones.length; i++) {
            if (opciones[i].idOpcionM === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...modificador };
        _product[`${name}`] = val;

        setModificador(_product);
    };

    const onInputChanceOpcionModificador = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _opcionM = { ...opcionModificador };
        _opcionM[`${name}`] = val;

        setOpcionModificador(_opcionM);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = {...opcionModificador};
        _product[`${name}`] = val;

        setOpcionModificador(_product);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-search" className="p-button-rounded p-button-info p-mr-2" tooltip='Ver detalle opciones' tooltipOptions={{position: 'top'}} onClick={()=> abrirOpciones(rowData)} />
                <Button icon="pi pi-plus" className="p-button-rounded p-button-secondary p-mr-2" tooltip='Agregar Opcion' tooltipOptions={{position: 'top'}} onClick={() => openNewOpcion(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const actionBodyTemplateOpcion = (rowData)=>{
        return (
            <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editOpcion(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteOpcion(rowData)} />
            </div>
        )
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0"><b>Administracion de Modificadores</b></h5>
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

    const opcionDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialogOpcion} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveOpcionModificador} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    const deleteOpcionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text"  onClick={hideDeleteOpcionDialog}  />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteOpcion} />
        </>
    );

    const EncontrarOpciones = (rowData) => {
        return opcionModificadores.filter(opcion => opcion?.modificadorIdModificador === rowData?.idModificador)
    }

    const BodyOpcionModificadorEnTabla = (rowData) => {

        if(opcionModificadores){

            let _opciones = EncontrarOpciones(rowData) 
            
            let texto = ''

            _opciones.forEach(opcion => {

                if(_opciones.indexOf(opcion) !== _opciones.length - 1){
                    texto += `${opcion.nombre}, `
                }else{
                    texto += `${opcion.nombre}. `
                }
            })
            

            if(_opciones){
                return (
                    <>
                        <span><b>{texto}</b></span>
                    </>
                );
            }else{
                
                console.log('Este Modificador no posee opciones')
            }
        }else{
            console.log('No hay data de opciones')
        }
    }
        
    const MonedaBodyTemplate1 = (rowData) => {
        
        return rowData.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits:0});
        
    }



    return (
        
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success p-button-rounded p-mb-3" onClick={openNew} />

                    <DataTable ref={dt} value={modificadores}
                        dataKey="idModificador" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Modificadores"
                        globalFilter={globalFilter} emptyMessage="Modificadores No Encontrados." header={header} loading={loading}>
                        
                        <Column field="nombre" header="Nombre" sortable ></Column>
                        <Column field="idModificador" header="OpcionModificador" body={BodyOpcionModificadorEnTabla}  sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px'}} header="Detalle Modificador " modal className="p-fluid " footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={modificador.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !modificador.nombre })} />
                            {submitted && !modificador.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                    </Dialog>

                    {/* -------Nuevo-------- */}
                    {/* Dialog Para ingresar una nuevo Modificador */}
                    <Dialog visible={opcionDialog} style={{ width: '450px'}} header="Opcion Modificador " modal className="p-fluid " footer={opcionDialogFooter} onHide={hideDialogOpcion}>
                        
                        <div className="p-field" style={{ marginBottom: '60px'}} >
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={opcionModificador.nombre} onChange={(e) => onInputChanceOpcionModificador(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted2 && !opcionModificador.nombre })} />
                            {submitted2 && !opcionModificador.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>
                        
                        <div className="p-field" style={{ marginBottom: '60px'}}>
                            <label htmlFor="precio">Precio</label>
                            <InputNumber id="precio" value={opcionModificador.precio} onChange={(e) => onInputNumberChange(e, 'precio')} required mode="currency" currency="CLP" locale="es-CL" className={classNames({ 'p-invalid': submitted2 && !opcionModificador.precio })} />
                            {submitted2 && !opcionModificador.precio && <small className="p-invalid">Precio Requerido.</small>}
                        </div>

                        <div className="p-field" >
                            <label htmlFor="orden">Orden</label>
                            <Dropdown id="orden" value={opcionModificador.orden} options={numOrden} placeholder='Seleccione Orden' onChange={(e) => onInputChanceOpcionModificador(e, 'orden')} />
                        </div>
                        
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {modificador && <span>Estas seguro que quieres eliminar el Modificador <b>{modificador.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={dialogVisible} style={{ width: '600px'}} header={`Detalle de opciones de Modificador: ${modificador.nombre} `} modal className="p-fluid " onHide={ocultarDialog}>

                        <DataTable value={opciones} className="datatable-responsive" emptyMessage="Modificador No posee Opciones.">
                            <Column field="nombre" header="Nombre"></Column>
                            <Column field="precio" header="Precio" body={MonedaBodyTemplate1} ></Column>
                            <Column field="orden" header="Orden"></Column>
                            <Column body={actionBodyTemplateOpcion}></Column>
                            
                        </DataTable>

                    </Dialog>

                    <Dialog visible={deleteOpcionDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteOpcionDialogFooter} onHide={hideDeleteOpcionDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {opcionModificador && <span>Estas seguro que quieres eliminar la Opcion Modificador <b>{opcionModificador.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                    

                </div>
            </div>
        </div>
    );
}