import React from 'react';

/* El div que tenga las mesas debe tener la propiedad p-d-flex */
const Mesa2 = ({nombre, disponibilidad}) => {

    const Disponible = '#AAAAAA'
    const Ocupado = '#FF0000'
    return (
        
            <button className='CajaBoton p-d-flex p-ai-center p-jc-center p-shadow-8'>

                <h5 className='TextoMesa'>{nombre}</h5>

                <i className="pi pi-circle-on Punto" style={!disponibilidad ? {color:Disponible} : {color:Ocupado}}></i>

            </button>
        
    );
};

export default Mesa2;