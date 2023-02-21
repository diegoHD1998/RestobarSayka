import React, { useState, useEffect, useMemo } from "react";
import { Calendar } from 'primereact/calendar'
import { addLocale } from 'primereact/api';
import StoredProcedureVentas from "../../service/InformeService/StoredProcedureVentas";
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend
);

const VentasEmpleados = () =>  {

    let fecha =  useMemo(() => {
        let date = new Date()
        return date
    },[]);

    const emptyFecha = {
        date1: fecha
    }

    const [Fecha, setFecha] = useState(emptyFecha);
    const [VentasEmpleados, setVentasEmpleados] = useState([])
    const storedProcedureVentas = new StoredProcedureVentas();

    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Claro'
    });
    
    useEffect(() => {
        let _fechas = {
            date1:`${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}`
        }
    
        console.log(_fechas)
        const storedProcedureVentas = new StoredProcedureVentas();
        storedProcedureVentas.GetVentasEmpleados(_fechas).then((res) => {
            if (res) {
                if (res.status >= 200 && res.status < 300) {
                    console.log(res.data)
                    setVentasEmpleados(res.data)
                }else{
                    console.log(res.data);
                    console.log("Error de status No controlado");
                }
            } else {
                console.log("BackEnd Abajo");
            }
        });
    }, [fecha]);

    const basicData = {
        labels: VentasEmpleados.map((value) => `${value.nombre} ${value.apellido}`),
        datasets: [
            {
                label: "Ventas",
                backgroundColor: 'rgba(66,165,245,0.2)',
                borderColor: '#42A5F5',
                data: VentasEmpleados.map((value) => value.totales),
                
            },
            {
                label: "Propina",
                borderColor: '#FFA726',
                backgroundColor: 'rgba(255,167,38,0.2)',
                data: VentasEmpleados.map((value) => value.propina),
            },
        ],
    };

    const horizontalOptions = {
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: "y",
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Ventas por Empleado",
            },
        },
        scales:{
            x:{
                ticks: {
                    beginAtZero: true,
                    // stepSize: 200000, 
                    callback: function(value) {
                        return value.toLocaleString("es-CL",{style:"currency", currency:"CLP"});
                    },
                }
            }
        },
    };



    const onInputChange = async(e, name) => {
        
        const val = (e.target && e.target.value) || '';
        let _fecha = {...Fecha};
        _fecha[`${name}`] = val;
        setFecha(_fecha)
        
        await storedProcedureVentas.GetVentasEmpleados(_fecha).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    console.log(res.data)
                    setVentasEmpleados(res.data)
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        })
        
    }

    return (

        <>
            <div className='p-fluid p-grid '>
                <div className='p-field'>
                    <Calendar id='date1' value={Fecha.date1} dateFormat='dd M yy' onChange={(e)=>onInputChange(e,'date1')}  showIcon className='p-mr-3' locale='es' />
                </div>
            </div>

            <div className='p-grid p-card p-jc-center'>

                <div className='p-col-12  '>
                    <Bar data={basicData} options={horizontalOptions} height={400} />
                </div>

            </div>
        </>

    );
}

export default VentasEmpleados;
