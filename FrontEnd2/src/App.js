import React, { useState, useEffect, useRef,useContext } from 'react';
import classNames from 'classnames';
import { Switch, Route, useHistory,Redirect } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { AppTopbar } from './AppTopbar';
/* import { AppFooter } from './AppFooter';*/
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { AppConfig } from './AppConfig';
import { AuthContext } from './auth/authContext';

import SalaDeVentas from './pages/SalaVentas/SalaDeVentas';
import ResumenVentas from './pages/Informes/ResumenVentas';
import VentasEmpleados from './pages/Informes/VentasEmpleados';
import VentasProductos from './pages/Informes/VentasProductos';
import VentasDelDia from './pages/Informes/VentasDelDia';
import VentasProductos2 from './pages/Informes/VentasProductos2';


import Mesas from './pages/MesasZonas/Mesas';
import Zonas from './pages/MesasZonas/Zonas';

import Modificadores from './pages/Productos/Modificadores';
import Categorias from './pages/Productos/Categorias';
import Productos from './pages/Productos/Productos';
import Variantes from './pages/Productos/Variantes';
import Impresoras from './pages/Productos/Impresoras';

import Roles from './pages/Usuarios/Roles'
import PedidosMesa from './pages/SalaVentas/PedidosMesa'

import PrimeReact from 'primereact/api';
import Admins from './pages/Usuarios/Admins';
import Meseros from './pages/Usuarios/Meseros';
import Bartenders from './pages/Usuarios/Bartenders';
import Cocineros from './pages/Usuarios/Cocineros';
import Experimento2 from './pages/Experimento2';

import Cocina from './pages/CocineroBartender/Cocina';
import Bar from './pages/CocineroBartender/Bar';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';

const App = () => {
    const {user} = useContext(AuthContext)
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('dark')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(false);
    const sidebar = useRef();

    const history = useHistory();
    /* let location = useLocation()
    console.log(location)
    const [ubicacion, setUbicacion] = useState(location.pathname) */

    let menuClick = false;

    useEffect(() => {
        if (sidebarActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [sidebarActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick && layoutMode === "overlay") {
            setSidebarActive(false);
        }
        menuClick = false;
    }

    const onToggleMenu = (event) => {
        menuClick = true;

        setSidebarActive((prevState) => !prevState);

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items && layoutMode === "overlay") { // aqui se cambia desde el and
            setSidebarActive(false);
        }
        /* if(!event.item.items && ubicacion==='/home/resumen-ventas'){
            setSidebarActive(false);
        }
         */
    }

    const privateRouteA1 = () => {
        if(user?.rol === 1)
            return true
        else
            return false
    }
    
    const privateRouteA2 = () => {
        if(user?.rol === 1 || user?.rol === 2)
            return true
        else
            return false
    }
    
    const privateRouteA3 = () => {
        if(user?.rol === 3)
            return true
        else
            return false
    }
    
    const privateRouteA4 = () => {
        if(user?.rol === 4)
            return true
        else
            return false
    }



    const menu = [
        { label: 'Sala de Ventas', icon: 'pi pi-fw pi-home', to: '/' },
        {
            label: 'Informes', icon: 'pi pi-fw pi-chart-bar',
            items: [
                { label: 'Ventas del Dia', icon: 'pi pi-fw pi-bookmark' , to: '/ventas-dia'},
                { label: 'Resumen de Ventas', icon: 'pi pi-fw pi-bookmark', to: '/resumen-ventas' },
                /* { label: 'Ventas por Empleado', icon: 'pi pi-fw pi-bookmark', to: '/ventas-empleados' }, */
                { label: 'Ventas por Producto', icon: 'pi pi-fw pi-bookmark', to: '/ventas-producto' },
                // { label:'ventasProducto2', icon: 'pi pi-fw pi-bookmark', to:'/ventas-producto2'},
            ]
        },
        {
            label: "Productos",
            icon: "pi pi-fw pi-book",
            items: [
                { label: "Lista de Productos", to: "/lista-productos" },
                { label: "Categorias", to: "/categoria" },
                { label: "Variantes", to: "/variantes" },
                { label: "Modificadores", to: "/modificadores" },
                { label: "Impresoras", to: "/impresoras" }
            ]
        },
        {
            label: "Usuarios",
            icon: "pi pi-fw pi-users",
            items: [
                { label: "Administradores",icon:'pi pi-fw pi-user' ,to: "/lista-administradores" },
                { label: "Meseros",icon:'pi pi-fw pi-user' ,to: "/lista-meseros" },
                { label: "Bartenders",icon:'pi pi-fw pi-user' ,to: "/lista-bartenders" },
                { label: "Cocineros",icon:'pi pi-fw pi-user' ,to: "/lista-cocineros" },

                { label: "Roles", icon:'pi pi-fw pi-user-minus', to: "/roles" },
                
            ]
        },
        {
            label: "Asingnacion Mesas",
            icon: "pi pi-fw pi-table",
            items: [
                { label: "Lista de Mesas" ,to: "/lista-mesas" },
                { label: "Zonas", to: "/zonas" },
                
            ]
        },
        /* { label: 'Experimento', icon: 'pi pi-fw pi-home', to: '/experimento2' }, */
    ];

    const menu2 = [
        { label: 'Sala de Ventas', icon: 'pi pi-fw pi-home', to: '/' },
        {
            label: "Productos",
            icon: "pi pi-fw pi-book",
            items: [
                { label: "Lista de Productos", to: "/lista-productos" },
                { label: "Categorias", to: "/categoria" },
                { label: "Variantes", to: "/variantes" },
                { label: "Modificadores", to: "/modificadores" },
            ]
        },
        {
            label: "Asingnacion Mesas",
            icon: "pi pi-fw pi-table",
            items: [
                { label: "Lista de Mesas" ,to: "/lista-mesas" },
                { label: "Zonas", to: "/zonas" },
                
            ]
        }
    ];

    const menu3 = [

    ]

    const menu4 = [

    ]

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const isSidebarVisible = () => {
        return sidebarActive;
    };

/*     const logo = layoutColorMode === 'dark' ? '/assets/layout/images/LogoSaykaNegro.svg' : '/assets/layout/images/logo.svg'; */

    const TextoLogo = layoutColorMode === 'dark' ? <span className='textoLogo blanco' >Sayka</span> : <span className='textoLogo negro' >Sayka</span>;

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-active': sidebarActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false
    });

    const sidebarClassName = classNames('layout-sidebar', {
        'layout-sidebar-dark': layoutColorMode === 'dark',
        'layout-sidebar-light': layoutColorMode === 'light'
    });


    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <AppTopbar onToggleMenu={onToggleMenu} />

            <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={isSidebarVisible()} unmountOnExit>
                <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
                    <div className="layout-logo" style={{cursor: 'pointer'}} onClick={() => history.push('/')}>
                        {/* <img alt="Logo" src={logo} /> */}
                        {TextoLogo}
                    </div>
                    <AppProfile />
                    <AppMenu model={user?.rol === 1 ? menu : user?.rol === 2 ? menu2 : user?.rol === 3 ? menu3 : menu4} onMenuItemClick={onMenuItemClick} />
                </div>
            </CSSTransition>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <div className="layout-main">
                <Switch>
                    {/* Informes */}
                    { privateRouteA1() && <Route exact path="/resumen-ventas"  component={ResumenVentas} /> }
                    { privateRouteA1() && <Route exact path="/ventas-dia" component={VentasDelDia} /> }
                    { privateRouteA1() && <Route exact path="/ventas-empleados"  component={VentasEmpleados} />}
                    { privateRouteA1() && <Route exact path="/ventas-producto"  component={VentasProductos} />}
                    {/* { privateRouteA1() && <Route exact path="/ventas-producto2"  component={VentasProductos2} />} */}

                    {/* Productos */}
                    { privateRouteA2() && <Route exact path="/lista-productos"  component={Productos} />}
                    { privateRouteA2() && <Route exact path="/categoria"  component={Categorias} />}
                    { privateRouteA2() && <Route exact path="/variantes"  component={Variantes} />}
                    { privateRouteA2() && <Route exact path="/modificadores"  component={Modificadores} />}
                    { privateRouteA1() && <Route exact path="/impresoras" component={Impresoras}/>}

                    {/* Usuarios */}
                    { privateRouteA1() && <Route exact path="/lista-administradores"  component={Admins} />}
                    { privateRouteA1() && <Route exact path="/lista-meseros"  component={Meseros} />}
                    { privateRouteA1() && <Route exact path="/lista-bartenders"  component={Bartenders} />}
                    { privateRouteA1() && <Route exact path="/lista-cocineros"  component={Cocineros} />}
                    { privateRouteA1() && <Route exact path="/roles"  component={Roles} />}

                    {/* Mesas */}
                    { privateRouteA2() && <Route exact path="/lista-mesas"  component={Mesas} />}
                    { privateRouteA2() && <Route exact path="/zonas"  component={Zonas} />}
                    { privateRouteA2() && <Route exact path="/pedido/:id/:name/:disp/:zona"  component={PedidosMesa}/>}
                    { privateRouteA2() && <Route exact path="/salaVentas" component={SalaDeVentas} />}

                    { privateRouteA3() && <Route exact path="/cocina" component={Cocina}/>}
                    { privateRouteA4() && <Route exact path="/bar" component={Bar}/>}
                    <Route exact path="/experimento2"  component={Experimento2} />

                    { privateRouteA2() ? <Redirect to='/salaVentas'/> : privateRouteA3() ? <Redirect to='/cocina'/> : <Redirect to='/bar'/> }

                </Switch>
            </div>

            <div class="layout-mask"></div>
            {/* <AppFooter /> */}
        </div>
    );

}

export default App;
