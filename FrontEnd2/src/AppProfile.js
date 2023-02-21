import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { AuthContext } from './auth/authContext';
import { types } from './types/types';
import {useHistory} from 'react-router-dom'

export const AppProfile = () => {

    const [expanded, setExpanded] = useState(false);
    const {user, dispatch} = useContext(AuthContext) // En user estan los datos del usuario en sesion
    const history = useHistory();

    const onClick = (event) => {
        setExpanded(prevState => !prevState);
        event.preventDefault();
    }

    const handleLogout = () => {
        dispatch({
            type:types.logout
        });
        history.replace('/Login')
    }

    return (
        <div className="layout-profile">
            <div>
                <img src="/assets/layout/images/profile.png" alt="Profile" />
            </div>
            <button className="p-link layout-profile-link" onClick={onClick}>
                <span className="username">{`${user.nombre} ${user.apellido}`}</span>
                <i className="pi pi-fw pi-cog" />
            </button>
            <CSSTransition classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={expanded} unmountOnExit>
                <ul className={classNames({ 'layout-profile-expanded': expanded })}>
                    <li><button type="button" className="p-link" onClick={()=>handleLogout()}><i className="pi pi-fw pi-sign-out" /><span>Logout</span></button></li>
                </ul>
            </CSSTransition>
        </div>
    );

}
