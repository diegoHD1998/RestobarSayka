import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { FileUpload } from 'primereact/fileupload';
import ProductoService from '../../service/ProductosService/ProductoService'
import CategoriaService from '../../service/ProductosService/CategoriaService'
import VarianteService from '../../service/ProductosService/VarianteService'
import OpcionVarianteService from '../../service/ProductosService/OpcionVarianteService'
import ModificadorService from '../../service/ProductosService/ModificadorService'
import OpcionModificadorService from '../../service/ProductosService/OpcionModificadorService'
import ProductoModificadorService from '../../service/ProductosService/ProductoModificadorService';
import {estados} from '../../service/Variables'
import axios from 'axios'



export default function Productos ()  {

    let emptyProduct = {
        idProducto: null,
        nombre: '',
        descripcion: '',
        precio: 0,
        imagen:'',
        estado:estados[0],
        categoriaIdCategoria:null,
        varianteIdVariante:null
    };

    const [productDialog, setProductDialog] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [productos, setProductos] = useState(null); 
    const [categorias, setCategorias] = useState(null);
    const [variantes, setVariantes] = useState(null);
    const [opcionesV, setOpcionesV] = useState(null)
    const [modificadores, setModificadores] = useState(null);
    const [opcionesM, setOpcionesM] = useState(null)
    const [productoModificadores, setProductoModificadores] =useState(null)
    const [producto, setProducto] = useState(emptyProduct);
    const [nombreV, setNombreV] = useState(null);
    const [loading, setLoading] = useState(true)
    const [loadingV, setloadingV] = useState(true) 
    const [categoriaSelected, setCategoriaSelected] = useState(null)

    const productoService = new ProductoService(); 
    const productoModificadorService = new ProductoModificadorService()
    const opcionVarianteService = new OpcionVarianteService();
    

    useEffect(() => {

        const categoriaService = new CategoriaService(); 
        categoriaService.readCategoriasActivas().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setCategorias(res.data)
                    
                    /* setloading(false) */
                }else{
                    console.log('Error al cargar Datos de Categorias')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo -1')
            }
            
        });

        const varianteService = new VarianteService();
        varianteService.readAll().then((res)=>{
            if(res){
                if(res.status >= 200 && res.status<300){

                    /* let _variantes = res.data
                    let _ValorNull = {
                        idVariante: null,
                        nombre: 'Sin Variante'
                    }

                    _variantes.push(_ValorNull) */
                    setVariantes(res.data)
                    /* setloading(false) */
                }else{
                    console.log('Error al cargar Datos de Variantes')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo -2')
            }
            
        });

        
        const productoService = new ProductoService();
        productoService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setProductos(res.data)
                    setLoading(false)
                    
                }else{
                    console.log('Error al cargar Datos de Productos')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo -3')
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                setLoading(false)
            }
            
        });

        const modificadorService = new ModificadorService();
        modificadorService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){

                    const _data = res.data.map(value => {
                        /* Aqui Escribir codigo de ProductoModificador*/
                            return {
                                ...value,
                                seleccionado:false,
    
                            }
                    });
                    setModificadores(_data)


                    
                }else{
                    console.log('Error ')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo -1')
            }
        });

        const opcionModificadorService = new OpcionModificadorService();
        opcionModificadorService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setOpcionesM(res.data)
                }else{
                    console.log('Error ')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo -1')
            }
        });

        const productoModificadorService = new ProductoModificadorService();
        productoModificadorService.readAll().then(res => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setProductoModificadores(res.data)
                    
                }else{
                    console.log('Error ')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo ')
            }
        })
    }, []);

    const abrirOpciones = (rowData) =>{
        opcionVarianteService.buscarOpciones(rowData.varianteIdVariante).then(res => {
            setOpcionesV(res.data)
            setloadingV(false)
            
        });
        let variante = variantes.find(val => val.idVariante === rowData.varianteIdVariante)

        setNombreV(variante.nombre)
        setDialogVisible(true)
    }

    const ocultarDialog = () =>{
        setDialogVisible(false)
        setOpcionesV(null)
        setNombreV(null)

    }

    const openNew = () => {
        setProducto(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
        const data1 = modificadores.map(value => {
            return{
                ...value,
                seleccionado:false,
            }
        })
        setModificadores(data1)
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        const data = modificadores.map(value => {
            return{
                ...value,
                seleccionado:false
            }
        })
        setModificadores(data)
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const saveProduct = async() => { 
        setSubmitted(true);

        if (producto.nombre.trim() && producto.estado.trim() && producto.precio != null && producto.categoriaIdCategoria != null) {
            let _productos = [...productos];
            let _producto = { ...producto };

            if (producto.idProducto) {
                await productoService.update(producto)
                .then(res => {

                    if(res.status >= 200 && res.status<300){

                        const index = findIndexById(producto.idProducto);
                        _productos[index] = _producto;
                        console.log(res.data)
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto Actualizado', life: 5000 });

                        let SwitchActivos = modificadores.filter(value => value.seleccionado === true);
                        if(SwitchActivos){
                            GuardarModificador(producto.idProducto,SwitchActivos)
                        }

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update de Producto, Status no controlado`, life: 5000 });
                    }
                    

                })
            }
            else {
                delete _producto.idProducto;
                await productoService.create(_producto)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        _productos.push(res.data);
                        console.log(res.data)
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto Creado', life: 5000 });

                        let SwitchActivos = modificadores.filter(value => value.seleccionado === true);
                        if(SwitchActivos){
                            GuardarModificador(res.data.idProducto,SwitchActivos)
                        }

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Producto, Status No controlado`, life: 5000 });
                    }
                });
            }

            setProductos(_productos);
            setProductDialog(false);
            setProducto(emptyProduct);
        }
    }

    const editProduct = (product) => {
        
        setProducto({ ...product });
        setProductDialog(true);

        let _modificadores = [...modificadores]
        
        console.log(product)
        console.log(productoModificadores)
        const TablaPivote = productoModificadores.filter(value => value.productoIdProducto === product.idProducto)
        console.log(TablaPivote)
        if(TablaPivote){

            TablaPivote.forEach((value) => {

                let _modificador = modificadores.find(value1 => value1.idModificador === value.modificadorIdModificador)
                
                let _activar = {
                    ..._modificador,
                    seleccionado:true
                }

                let index = findIndexByIdM(_modificador.idModificador)
                _modificadores[index] = _activar
                console.log(_modificadores[index])
            });
            
        }
        setModificadores(_modificadores)
        

    }

    
    const confirmDeleteProduct = (product) => {
        setProducto(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async() => { 
        await productoService.delete(producto.idProducto)
        .then(res => {

            if(res.status >= 200 && res.status < 300){

                setProductos(productos.filter(val => val.idProducto !== res.data))
                setDeleteProductDialog(false);
                setProducto(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto Eliminado', life: 5000 });

            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Producto, Status No controlado`, life: 5000 });
            }
        });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].idProducto === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onUpload = ({files}) => {
        const [file] = files;
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            uploadInvoice(e.target.result);
        };
        fileReader.readAsDataURL(file);
    };

    const uploadInvoice = async (invoiceFile) => {
        let formData = new FormData();
        formData.append('invoiceFile', invoiceFile);
        console.log(formData)
        const response = await axios.post(`${process.env.REACT_APP_URL_BASE}/Productos/CargarImagen`, formData)
        console.log('estoy aqui en imagen')
            
    };

    const findIndexByIdM = (id) => {
        let index = -1;
        for (let i = 0; i < modificadores.length; i++) {
            if (modificadores[i].idModificador === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexByIdPivote = (idP, idM) => {
        let index = -1;
        for (let i = 0; i < productoModificadores.length; i++) {
            if (productoModificadores[i].productoIdProducto === idP && productoModificadores[i].modificadorIdModificador === idM) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...producto };
        _product[`${name}`] = val;

        if(name === 'varianteIdVariante' && val === ''){
            _product[`${name}`] = null;
        }

        setProducto(_product);
    }
    
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = {...producto};
        _product[`${name}`] = val;
        
        setProducto(_product);
    }

    const onCategoriaChange =(e) => {
        dt.current.filter(e.value, 'categoriaIdCategoria', 'equals');
        setCategoriaSelected(e.value);
    }

    const onChangeSwitch = (mod) => {
        const data = modificadores.map(value => {
            if(value.idModificador === mod.idModificador){
                return {
                    ...value,
                    seleccionado:!value.seleccionado
                }
            }else{
                return {
                    ...value
                }
            }
        });
        setModificadores(data)
    }

    const ColorBodytemplate = (rowData) => {

        if(categorias){

            let _categoria = categorias.find(val => val?.idCategoria === rowData?.categoriaIdCategoria)  

            return (
                <>
                    <div className={`cuadro1`} style={{background:`#${_categoria?.color}`}}>
                    <span className={`texto1`}>{`${_categoria?.nombre}`}</span>
                    </div>
                </>
            );
        }
    }

    const VarianteBodyTemplate = (rowData) => {
        if(variantes){
            let _variante = variantes.find( val => val?.idVariante === rowData?.varianteIdVariante)
            
            if(_variante !== undefined){
                return(
                    <>
                        <Button label={`${_variante?.nombre}`} icon="pi pi-search" iconPos='right' className="p-button-info p-button-rounded" style={{fontSize:'10px'}} onClick={()=> abrirOpciones(rowData)} />
                    </>
                )
            }/* else{
                return(
                    <>
                        <span>No aplica</span>
                    </>
                )
            } */
            
        }
    }

    const MonedaBodyTemplate = (rowData) => {

        return rowData.precio ? rowData.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits:0}) : '';

    }

    const ImagenBodyTemplate = (rowData) => {
        return <img src={rowData.imagen} style={{width:'60px'}} alt={rowData.nombre} />
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

    const MostrarOcionesM = (mod) => {

        if(opcionesM){
            let opciones = opcionesM.filter(value => mod.idModificador === value?.modificadorIdModificador)
            let texto = ''
            if(opciones){
                opciones.forEach((value) => {
                    if(opciones.indexOf(value) !== opciones.length - 1){
                        texto += `${value.nombre}, `
                    }else{
                        texto += `${value.nombre}.`
                    }
                });
                return(
                    <>
                        <span>{texto}</span>
                    </>
                )
            }
        }
    }  

    const GuardarModificador = async (_idProducto, SwitchActivos) =>{
        
        await productoModificadorService.pmExistente(_idProducto).then(res => {
            
            if( res.data.length !== 0 ){ /* El array tiene datos */
                
                if(SwitchActivos){

                    SwitchActivos.forEach((value) => {
                        let pivote = res.data.find(value2 => value2.modificadorIdModificador === value.idModificador )
    
                        if(!pivote){
                            /* Create */
                            let data = {
                                productoIdProducto: _idProducto,
                                modificadorIdModificador: value.idModificador
                            }
                            
                            let _productModifys = [...productoModificadores]

                            
                            productoModificadorService.create(data).then(res => {
                                if(res){
                                    if(res.status >= 200 && res.status<300){
                                        console.log('El producto modificador se Guardo Exitozamente')
                                        _productModifys.push({
                                            productoIdProducto: res.data.productoIdProducto,
                                            modificadorIdModificador: res.data.modificadorIdModificador
                                        })
                                        
                                    }else{
                                        console.log(res.data)
                                    }
                                }
                            });
                            setProductoModificadores(_productModifys)

                        }
                        
                    });
    
                }

                res.data.forEach((value) => {
                    let activo = SwitchActivos.find(value2 => value2.idModificador === value.modificadorIdModificador )

                    if(!activo){
                        let _pivotes = [...productoModificadores]
                        let index = findIndexByIdPivote(value.productoIdProducto,value.modificadorIdModificador)
                        _pivotes.splice(index,1)
                       
                        
                        /* Delete */
                        productoModificadorService.delete(value.productoIdProducto, value.modificadorIdModificador).then(res => {
                            if(res){
                                if(res.status >= 200 && res.status<300){

                                    console.log('El producto modificador fue eliminado')
                                    console.log(res.data)
                                    
                                    setProductoModificadores(_pivotes)
                                }else{
                                    console.log(res.data)
                                }
                            }
                        })
                    }
                })


            }else{ /* El array esta vacio */
                if(SwitchActivos){
                    
                    let _productoModificadores = [...productoModificadores]
                    SwitchActivos.forEach((value) => {
                        let data = {
                            productoIdProducto: _idProducto,
                            modificadorIdModificador: value.idModificador
                        }
                        
                        productoModificadorService.create(data).then(res => {
                            if(res){
                                if(res.status >= 200 && res.status<300){
                                    console.log('El producto modificador se Guardo Exitozamente')
                                    console.log(res.data)
                                    _productoModificadores.push(res.data)

                                }else{
                                    console.log(res.data)
                                }
                            }
                        });
                        
                    });
                    setProductoModificadores(_productoModificadores)
                }
            }
        });



    }




    const header = (/* <----------------- */
        <div className="table-header">
            <h5 className="p-m-0"><b>Administracion de Productos</b></h5>
            <div>
                <Dropdown value={categoriaSelected} options={categorias} optionLabel='nombre' optionValue='idCategoria' placeholder='Buscar por Categoria' onChange={(e)=>onCategoriaChange(e)} className='p-column-filter' showClear />
                <span className="p-input-icon-left p-ml-2">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar por Nombre" />
                </span>
            </div>
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

    const MonedaBodyTemplate1 = (rowData) => {

        return rowData.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits:0});
        
    }

    return (
        
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success p-button-rounded p-mb-3" onClick={openNew} />

                    <DataTable ref={dt} header={header} value={productos} dataKey="idProducto" /* sortMode="single" */ sortField="nombre" sortOrder={1} className="datatable-responsive" 
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Productos"
                        globalFilter={globalFilter} emptyMessage="Productos No Encontrados."  loading={loading}>
                        
                        <Column field="nombre" header="Nombre" ></Column>
                        {/* <Column field="descripcion" header="Descripcion" ></Column> */}
                        <Column field="precio" body={MonedaBodyTemplate} header="Precio" ></Column>
                        <Column field="imagen" header="Imagen" body={ImagenBodyTemplate} ></Column>
                        <Column field="estado" body={statusBodyTemplate} header="Estado" ></Column>
                        <Column field="varianteIdVariante" body={VarianteBodyTemplate} header="Variante" ></Column>
                        <Column field="categoriaIdCategoria" body={ColorBodytemplate} header="Categoria" ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px'}} header="Detalle Producto " modal className="p-fluid " footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={producto.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !producto.nombre })} />
                            {submitted && !producto.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="descripcion">Descripcion</label>
                            <InputTextarea id="descripcion" value={producto.descripcion} onChange={(e) => onInputChange(e, 'descripcion')}/>
                            
                        </div>

                        <div className="p-field">
                            <label htmlFor="precio">Precio</label>
                            <InputNumber id="precio" value={producto.precio} onChange={(e) => onInputNumberChange(e, 'precio')} required mode="currency" currency="CLP" locale="es-CL" className={classNames({ 'p-invalid': submitted && !producto.precio })} />
                            {submitted && !producto.precio && <small className="p-invalid">Precio Requerido.</small>}
                        </div>

                        <div className="p-field" >
                            <label htmlFor="categoriaIdCategoria">Categoria</label>
                            <Dropdown id="categoriaIdCategoria" optionLabel="nombre" optionValue="idCategoria" value={producto.categoriaIdCategoria} options={categorias} placeholder='Seleccione Categoria' onChange={(e) => onInputChange(e, 'categoriaIdCategoria')} required className={classNames({ 'p-invalid': submitted && !producto.categoriaIdCategoria })}rows={3} cols={20} />
                            {submitted && !producto.categoriaIdCategoria && <small className="p-invalid">Categoria Requerida.</small>}
                        </div>

                        <div className="p-field" >
                            <label htmlFor="varianteIdVariante">Variante</label>
                            <Dropdown id="varianteIdVariante" optionLabel="nombre" optionValue="idVariante" value={producto.varianteIdVariante} options={variantes} placeholder='Seleccione Variante' onChange={(e) => onInputChange(e, 'varianteIdVariante')} showClear   rows={3} cols={20} />
                        </div>

                        {/* ------------------------------------------------------------------------------------------------------------ */}
                        <div className="p-field" /* style={{height:'100px'}} */>
                            <label htmlFor="estado">Estado</label>
                            <Dropdown id="estado" value={producto.estado} options={estados} placeholder='Seleccione Estado' onChange={(e) => onInputChange(e, 'estado')} required className={classNames({ 'p-invalid': submitted && !producto.estado })}rows={3} cols={20} />
                            {submitted && !producto.estado && <small className="p-invalid">Estado Requerido.</small>}
                        </div>

                        
                        <div className="p-field" >
                            <label htmlFor="imagen">Imagen</label>
                            <InputText id="imagen" value={producto.imagen} onChange={(e) => onInputChange(e, 'imagen')}  />
                        </div>

                        {/* <div className="p-field" >
                            <FileUpload mode="basic" id='imagen' customUpload name="imagen21" auto accept="image/*" maxFileSize={1000000} uploadHandler={onUpload} />
                        </div> */}

                        
                        <div className="p-field">
                            <label>Modificadores</label>
                        {
                            modificadores?.map(mod => 
                            
                                <div key={mod.idModificador} className='p-d-flex p-jc-between p-p-2'>
                                    <div> 
                                        <span>
                                            <b>{mod.nombre}: </b>
                                        </span> 
                                        <span>
                                            {MostrarOcionesM(mod)}
                                        </span> 
                                    </div> 
                                    <div> 
                                        <InputSwitch checked={mod.seleccionado} onChange={()=> onChangeSwitch(mod)} /> 
                                    </div> 
                                </div>
                            )
                        }
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {producto && <span>Estas seguro que quieres eliminar el producto <b>{producto.nombre}</b>?</span>}
                        </div>
                    </Dialog>


                    <Dialog visible={dialogVisible} style={{ width: '600px'}} header={`Detalle de opciones de Variante: ${nombreV} `} modal className="p-fluid " onHide={ocultarDialog}>

                        <DataTable value={opcionesV} className="datatable-responsive" emptyMessage="Variante No posee Opciones." loading={loadingV}>
                            <Column field="nombre" header="Nombre"></Column>
                            <Column field="precio" header="Precio" body={MonedaBodyTemplate1} ></Column>
                            <Column field="orden" header="Orden"></Column>
                        </DataTable>

                    </Dialog>

                </div>
            </div>
        </div>
    );
}
