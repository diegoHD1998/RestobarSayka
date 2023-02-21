import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import md5 from 'md5'

import UsuarioService from '../../service/UsuariosService/UsuarioService';
import {estados} from '../../service/Variables'

export default function Cocineros ()  {

    let emptyUsuario = {
        idUsuario: null,
        nombre:'',
        apellido:'',
        telefono:'+569',
        email:'',
        direccion:'',
        userName:'',
        password:'',
        estado:estados[0],
        rolIdRol: 3

    };

    const [usuarios, setUsuarios] = useState(null);
    const [usuario, setUsuario] = useState(emptyUsuario);
    const [password2, setPassword2] = useState(null)
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setloading] = useState(true);
    const [validar, setValidar] = useState(null)
    const toast = useRef(null);
    const dt = useRef(null);
    

    const [confirmPass, setConfirmPass] = useState(false)
    
    const usuarioService = new UsuarioService();

    useEffect(() => {
        const usuarioService = new UsuarioService();
        usuarioService.readCocineros().then(res => {
            if(res){
                if(res.status >= 200 && res.status <300){
                    setUsuarios(res.data)
                    setloading(false)
                }else{
                    console.log('Error al Cargar los Datos de Usuario')
                }
            }else{
                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setloading(false)
            }
        });

    }, []);


    const openNew = () => {
        setUsuario(emptyUsuario);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setUsuario(emptyUsuario)
        setPassword2(null)
        setConfirmPass(false)
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const saveProduct = async() => { 
        setSubmitted(true);

        if(usuario.userName.trim()){
            let validacion = null
            await usuarioService.validarUserName(usuario.userName).then(res =>{
                if(res.status === 200){
                    if(usuario.idUsuario === res.data.idUsuario){
                        setValidar(null)
                    }else{
                        setValidar(res.data)
                        validacion = res.data
                    }
                }else if(res.status === 204){
                    setValidar(null)
                }
            })
            console.log(validacion)
            if(validacion === null){

                if (usuario.nombre.trim() && usuario.apellido.trim() && usuario.telefono.trim() 
                 && usuario.password.trim() && usuario.estado.trim() && password2.trim() && confirmPass === true ) {
                    let _usuarios = [...usuarios];
                    let _usuario = { ...usuario };
        
                    
                    if (usuario.idUsuario) {
                        _usuario.password = md5(usuario.password)
                        await usuarioService.update(_usuario)
                        .then(res => {
                            if(res.status >= 200 && res.status<300){
        
                                const index = findIndexById(usuario.idUsuario);
                                _usuarios[index] = _usuario;
                                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuario Actualizado', life: 5000 });
                                console.log(res.data);
        
                            }else if(res.status >= 400 && res.status<500){
                                console.log(res)
                                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Usuario No Actualizado: ${res.data}`, life: 5000 });
                            }else{
                                console.log(res)
                                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update Usuario, Status No controlado`, life: 5000 });
                            }
                            
        
                        })
                    }
                    else {
                        delete _usuario.idUsuario;
                        _usuario.password = md5(usuario.password)
                        await usuarioService.create(_usuario)
                        .then(res => {
                            if(res.status >= 200 && res.status<300){
                                _usuarios.push(res.data);
                                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuario Creado', life: 5000 });
                                console.log(res.data)
                            } else if(res.status >= 400 && res.status<500){
                                console.log(res)
                                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                            }else{
                                console.log(res)
                                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Usuario, Status No controlado`, life: 5000 });
                            }
                        });
                    }
        
                    setUsuarios(_usuarios);
                    setProductDialog(false);
                    setUsuario(emptyUsuario);
                    setPassword2(null)
                    setConfirmPass(false)
                }
            }

        }

    }

    const editProduct = (product) => {
        setUsuario({ ...product });
        setPassword2(product.password)
        setProductDialog(true);
    }

    /* const confirmDeleteProduct = (product) => {
        setUsuario(product);
        setDeleteProductDialog(true);
    } */

    const deleteProduct = async() => { 
        await usuarioService.delete(usuario.idUsuario)
        .then(res => {
            if(res.status >= 200 && res.status<300){

                console.log(res.data)
                setUsuarios(usuarios.filter(val => val.idUsuario !== res.data))
                setDeleteProductDialog(false);
                setUsuario(emptyUsuario);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Usuario Eliminado', life: 5000 });

            }else if(res.status >= 400 && res.status<500){
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Usuario, Status No controlado`, life: 5000 });
            }            
        });
        
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].idUsuario === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    
    const validarPass = (Pass1, Pass2) => {

        if(Pass2 === undefined){
            let _password1 = Pass1
            let _password2 = password2

            if(_password1 !== _password2 || !_password1){
                setConfirmPass(false)
            }else{
                setConfirmPass(true)
            }
        }else{
            if(Pass1 !== Pass2 || !Pass2){
                setConfirmPass(false)
            }else{
                setConfirmPass(true)
            }
        }
        
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...usuario };
        _product[`${name}`] = val;
        setUsuario(_product);
        if(name === 'password'){
            validarPass(val)
        }
    }

    const onInputChangePass = (e) => {
        const _password1 = usuario.password
        const _password2 = e.target.value
        setPassword2(_password2)
        validarPass(_password1, _password2)
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} />
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProduct(rowData)} /> */}
            </div>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge-1 status-${rowData.estado.toLowerCase()}`}>{rowData.estado}</span>;
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0"><b>Administracion de Cocineros</b></h5>
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

                    <DataTable ref={dt} value={usuarios} 
                        dataKey="idUsuario" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Usuarios"
                        globalFilter={globalFilter} emptyMessage="Usuarios No Encontrados." header={header} loading={loading}>
                        
                        <Column field="userName" header="UserName" ></Column>
                        <Column field="nombre" header="Nombre" ></Column>
                        <Column field="apellido" header="Apellidos" ></Column>
                        <Column field="telefono" header="Telefono" ></Column>
                        <Column field="direccion" header="Direccion" ></Column>
                        <Column field="estado" header="Estado" body={statusBodyTemplate}></Column>
                        <Column field="email" header="Email"></Column>
                        <Column></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px'}} header="Detalle Usuario " modal className="p-fluid " footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={usuario.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !usuario.nombre })} />
                            {submitted && !usuario.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="apellido">Apellido</label>
                            <InputText id="apellido" value={usuario.apellido} onChange={(e) => onInputChange(e, 'apellido')} required  className={classNames({ 'p-invalid': submitted && !usuario.apellido })} />
                            {submitted && !usuario.apellido && <small className="p-invalid">Apellido Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="telefono">Telefono</label>
                            <InputText id="telefono" value={usuario.telefono} onChange={(e) => onInputChange(e, 'telefono')} required className={classNames({ 'p-invalid': submitted && !usuario.telefono })} />
                            {submitted && !usuario.telefono && <small className="p-invalid">Telefono Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={usuario.email} onChange={(e) => onInputChange(e, 'email')}/>
                        </div>

                        <div className="p-field">
                            <label htmlFor="direccion">Direccion</label>
                            <InputText id="direccion" value={usuario.direccion} onChange={(e) => onInputChange(e, 'direccion')}/>
                        </div>

                        <div className="p-field">
                            <label htmlFor="estado">Estado</label>
                            <Dropdown id="estado" value={usuario.estado} options={estados} placeholder='Seleccione estado' onChange={(e) => onInputChange(e, 'estado')} required className={classNames({ 'p-invalid': submitted && !usuario.estado })}rows={3} cols={20} />
                            {submitted && !usuario.estado && <small className="p-invalid">Estado Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="userName">UserName</label>
                            <InputText id="userName" value={usuario.userName} onChange={(e) => onInputChange(e, 'userName')} required className={classNames({ 'p-invalid': submitted && !usuario.userName },{ 'p-invalid': submitted && validar })} />
                            {submitted && !usuario.userName && <small className="p-invalid">UserName Requerido.</small>}{submitted && validar && <small className="p-invalid">Este UserName ya esta Registrado en el Sistema.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="password">Nueva Contraseña</label>
                            <Password id="password" value={usuario.password} feedback={false} onChange={(e) => onInputChange(e, 'password')} toggleMask  required className={classNames({ 'p-invalid': submitted && !usuario.password })} />
                            {submitted && !usuario.password && <small className="p-invalid">Contraseña Requerida.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="password2">Confirmar Contraseña</label>
                            <span className="p-float-label p-input-icon-right">
                                <Password id="password2" value={password2} onChange={(e)=>onInputChangePass(e)} feedback={false} required className={classNames({ 'p-invalid': submitted && !confirmPass })}/>
                                <i className={!confirmPass ? "pi pi-times-circle" : "pi pi-check"} style={!confirmPass ? {color:'red',fontWeight:'bold'} : {color:'green',fontWeight:'bold'}}/>
                                {submitted && !confirmPass && <small className="p-invalid">Contraseñas no coinciden.</small>}
                            </span>
                        </div>
                
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Estas seguro que quieres eliminar el usuario <b>{usuario.nombre} {usuario.apellido}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}