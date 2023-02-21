import React, { useContext, useRef } from 'react';
import { confirmDialog } from 'primereact/confirmdialog';
import { useHistory } from 'react-router-dom'
import { AuthContext } from './auth/authContext';
import { types } from './types/types';
import { Toast } from 'primereact/toast';

export const AppTopbar = (props) => {

    const {user,dispatch} = useContext(AuthContext) // En user estan los datos del usuario en sesion
    const toast = useRef(null);
    const history = useHistory()

    const accept = () => {
        dispatch({
            type:types.logout
        });
        history.replace('/Login')
    }

    const confirm1 = () => {
        confirmDialog({
            message: 'Estas seguro que quieres cerrar sesion?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel:'Si',
            rejectLabel:'No',
            accept,
            
        });
    };

    
    return (
        <div className="layout-topbar clearfix">
            <Toast ref={toast} />
            <button type="button" className="p-link layout-menu-button" onClick={props.onToggleMenu}>
                <span className="pi pi-bars" />
            </button>
            <div className="layout-topbar-icons">
                <button type="button" className="p-link" onClick={()=>confirm1()}>
                    
                    <div className='p-d-flex'>
                        <span className='p-mr-2'>{`${user.nombre} ${user.apellido}`}</span>
                        <span className="layout-topbar-icon pi pi-sign-out" />
                    </div>

                </button>

                
            </div>
        </div>
    );
}
