import React, { useState, useEffect, useRef } from 'react';
/* import { Link } from 'react-router-dom'; */
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import VarienteService from '../../service/ProductosService/VarianteService'
import OpcionVarianteService from '../../service/ProductosService/OpcionVarianteService'
import { numOrden } from '../../service/Variables';




export default function Variantes ()  {

    let emptyProduct = {
        idVariante: null,
        nombre: ''
    };

    let emptyOpcionVariante = {
        idOpcionV: null,
        nombre: '',
        precio: 0,
        varianteIdVariante: null,
        orden: null
    }

    const [variantes, setVarientes] = useState(null);
    const [variante, setVariante] = useState(emptyProduct);

    const [opcionVariantes, setOpcionVariantes] = useState(null); 
    const [opcionVariante, setOpcionVariante] = useState(emptyOpcionVariante);
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
    
    const varienteService = new VarienteService(); 
    const opcionVarianteService = new OpcionVarianteService()
    
    useEffect(() => {

        const varienteService = new VarienteService();
        varienteService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setVarientes(res.data)
                    setloading(false)
                }else{
                    console.log('Error al cargar Datos de Variantes')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo')
            }
            
            
        });
        

        const opcionVarianteService = new OpcionVarianteService();
        opcionVarianteService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setOpcionVariantes(res.data)
                }else{
                    console.log('Error al cargar Datos de OpcionVariantes')
                }
            }else{
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setloading(false)
            }
            
        });
        
        
    }, []);
    
    const abrirOpciones = (rowData) =>{
        setVariante(rowData)
        setOpciones(EncontrarOpciones(rowData))
        setDialogVisible(true)
    }
    
    const ocultarDialog = () =>{
        setDialogVisible(false)
        setVariante(emptyProduct)
        setOpciones(null)
    }

    const openNew = () => {
        setVariante(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }
    
    const openNewOpcion = (data) => {

        setOpcionVariante(emptyOpcionVariante);
        setOpcionVariante({varianteIdVariante: data.idVariante})
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

        if (variante.nombre.trim()) {
            let _variantes = [...variantes];
            let _variante = { ...variante };

            if (variante.idVariante) {
                await varienteService.update(variante)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        const index = findIndexById(variante.idVariante);
                        _variantes[index] = _variante;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Variante Actualizada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update de Variante, Status no controlado`, life: 5000 });
                    }
                    

                })
            }
            else {
                delete _variante.idVariante;
                await varienteService.create(_variante)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        _variantes.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Variante Creada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Variante, Status No controlado`, life: 5000 });
                    }
                });
            }

            setVarientes(_variantes);
            setProductDialog(false);
            setVariante(emptyProduct);
        }
    }
    
    const saveOpcionVariante = async() => { 
        setSubmitted2(true);

        if (opcionVariante.nombre && opcionVariante.precio) {
            let _OpcionVariantes = [...opcionVariantes];
            let _OpcionVariante = { ...opcionVariante };
            

            
            if(opcionVariante.idOpcionV){
                await opcionVarianteService.update(opcionVariante)
                .then(res => {
                    if(res.status >= 200 && res.status<300){
                        const index = findIndexById2(opcionVariante.idOpcionV);
                        _OpcionVariantes[index] = _OpcionVariante;
                        
                        let _Opciones = [...opciones]
                        const index2 = findIndexById3(opcionVariante.idOpcionV);
                        _Opciones[index2] = _OpcionVariante
                        setOpciones(_Opciones)

                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Opcion Variante Actualizada', life: 5000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update de Opcion Variante, Status no controlado`, life: 5000 });
                    }
                });
            }else{

                delete _OpcionVariante.idOpcionV;
                await opcionVarianteService.create(_OpcionVariante)
                .then(res => {
                    if(res.status >= 200 && res.status < 300){
                        _OpcionVariantes.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Opcion Variante Creada', life: 5000 });
                        console.log(res.data)
                    }else if(res.status >= 400 && res.status < 500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create OpcionVariante, Status No controlado`, life: 5000 });
                    }
                });
            }
            
            setOpcionVariantes(_OpcionVariantes);
            setOpcionDialog(false);
            setOpcionVariante(emptyOpcionVariante);
            
        }
    }

    const editProduct = (product) => {
        setVariante({ ...product });
        setProductDialog(true);
    }
    const editOpcion = (opcion) => {
        setOpcionVariante({...opcion});
        setOpcionDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setVariante(product);
        setDeleteProductDialog(true);
    }

    const confirmDeleteOpcion = (opcion) => {
        setOpcionVariante(opcion)
        setDeleteOpcionDialog(true)
    }

    const deleteProduct = async() => { 
        await varienteService.delete(variante.idVariante)
        .then(res => {

            if(res.status >= 200 && res.status < 300){
                setVarientes(variantes.filter(val => val.idVariante !== res.data))
                setDeleteProductDialog(false);
                setVariante(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Variante Eliminada', life: 5000 });

            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Variante, Status No controlado`, life: 5000 });
            }
        });
    }

    const deleteOpcion = async() => { 
        await opcionVarianteService.delete(opcionVariante.idOpcionV)
        .then(res => {

            if(res.status >= 200 && res.status < 300){

                setOpcionVariantes(opcionVariantes.filter(val => val.idOpcionV !== res.data));
                setOpciones(opciones.filter(val => val.idOpcionV !== res.data));
                setDeleteOpcionDialog(false);
                setOpcionVariante(emptyOpcionVariante);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Opcion Variante Eliminada', life: 5000 });
                
            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Opcion Variante, Status No controlado`, life: 5000 });
            }
        });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < variantes.length; i++) {
            if (variantes[i].idVariante === id) {
                index = i;
                break;
            }
        }

        return index;
    };
    
    
    const findIndexById2 = (id) => {
        let index = -1;
        for (let i = 0; i < opcionVariantes.length; i++) {
            if (opcionVariantes[i].idOpcionV === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexById3 = (id) => {
        let index = -1;
        for (let i = 0; i < opciones.length; i++) {
            if (opciones[i].idOpcionV === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...variante };
        _product[`${name}`] = val;

        setVariante(_product);
    };

    const onInputChanceOpcionVariante = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _opcionV = { ...opcionVariante };
        _opcionV[`${name}`] = val;
        setOpcionVariante(_opcionV);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = {...opcionVariante};
        _product[`${name}`] = val;

        setOpcionVariante(_product);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-search" className="p-button-rounded p-button-info p-mr-2" tooltip='Ver detalle opciones' tooltipOptions={{position: 'top'}} onClick={()=> abrirOpciones(rowData)} />
                <Button icon="pi pi-plus" className="p-button-rounded p-button-secondary p-mr-2" tooltip='Agregar Opciones' tooltipOptions={{position: 'top'}} onClick={() => openNewOpcion(rowData)} />
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
            <h5 className="p-m-0"><b>Administracion de Variantes </b> </h5>
            
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
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveOpcionVariante} />
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
        return opcionVariantes.filter(opcion => opcion?.varianteIdVariante === rowData?.idVariante) 
    }

    const BodyOpcionVarianteEnTabla = (rowData) => {

        if(opcionVariantes){
            //Preguntar aqui
            
            /* opcionVarianteService.buscarOpciones(rowData.idVariante)
            .then(res => console.log(res)) */

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
                
                console.log('Esta Variante no posee opciones')
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

                    <DataTable ref={dt} value={variantes}
                        dataKey="idVariante" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Variantes"
                        globalFilter={globalFilter} emptyMessage="Variantes No Encontradas." header={header} loading={loading}>
                        
                        <Column field="nombre" header="Nombre" sortable ></Column>
                        <Column field="idVariante" header="OpcionVariante" body={BodyOpcionVarianteEnTabla}  sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px'}} header="Detalle Variante " modal className="p-fluid " footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={variante.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !variante.nombre })} />
                            {submitted && !variante.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                    </Dialog>

                    
                    {/* Dialog Para ingresar una nueva opcionVariante */}
                    <Dialog visible={opcionDialog} style={{ width: '450px'}} header="Opcion Variante " modal className="p-fluid " footer={opcionDialogFooter} onHide={hideDialogOpcion}>
                        
                        <div className="p-field" style={{ marginBottom: '60px'}} >
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={opcionVariante.nombre} onChange={(e) => onInputChanceOpcionVariante(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted2 && !opcionVariante.nombre })} />
                            {submitted2 && !opcionVariante.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>
                        
                        <div className="p-field" style={{ marginBottom: '60px'}}>
                            <label htmlFor="precio">Precio</label>
                            <InputNumber id="precio" value={opcionVariante.precio} onChange={(e) => onInputNumberChange(e, 'precio')} required mode="currency" currency="CLP" locale="es-CL" className={classNames({ 'p-invalid': submitted2 && !opcionVariante.precio })} />
                            {submitted2 && !opcionVariante.precio && <small className="p-invalid">Precio Requerido.</small>}
                        </div>

                        <div className="p-field" >
                            <label htmlFor="orden">Orden</label>
                            <Dropdown id="orden" value={opcionVariante.orden} options={numOrden} placeholder='Seleccione Orden' onChange={(e) => onInputChanceOpcionVariante(e, 'orden')} />
                        </div>
                        
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {variante && <span>Estas seguro que quieres eliminar la Variente <b>{variante.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={dialogVisible} style={{ width: '600px'}} header={`Detalle de opciones de Variante: ${variante.nombre} `} modal className="p-fluid " onHide={ocultarDialog}>

                        <DataTable value={opciones} className="datatable-responsive" emptyMessage="Variante No posee Opciones.">
                            <Column field="nombre" header="Nombre"></Column>
                            <Column field="precio" header="Precio" body={MonedaBodyTemplate1} ></Column>
                            <Column field="orden" header="Orden"></Column>
                            <Column body={actionBodyTemplateOpcion}></Column>
                            
                        </DataTable>

                    </Dialog>

                    <Dialog visible={deleteOpcionDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteOpcionDialogFooter} onHide={hideDeleteOpcionDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {opcionVariante && <span>Estas seguro que quieres eliminar la Opcion Variente <b>{opcionVariante.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                    

                </div>
            </div>
        </div>
    );
}