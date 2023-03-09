import React, {useState, useEffect, useMemo} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Calendar} from 'primereact/calendar'
import { addLocale } from 'primereact/api';
import StoredProcedureVentas from '../../service/InformeService/StoredProcedureVentas'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, 
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  import { Line, Bar } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, 
    Title,
    Tooltip,
    Legend
  );

const VentasDelDia = () => {
    let fecha =  useMemo(() => {
        let date = new Date()
        return date
    },[]);
    
    const emptyFecha = {
        date1:fecha
    }

    const [Fecha, setFecha] = useState(emptyFecha)
    const [VentasD, setVentasD] = useState([])
    const [VentasEmpleados, setVentasEmpleados] = useState([])

    const [VentaBruta, setVentaBruta] = useState(0)
    const [VentaNeta, setVentaNeta] = useState(0)
    const [Propinas , setPropinas] = useState(0)

    const [Efectivo, setEfectivo] = useState(0)
    const [Tarjeta, setTarjeta] = useState(0)
    const [Transfe, setTransfe] = useState(0)

    const storedProcedureVentas = new StoredProcedureVentas()

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
    

    useEffect(()=>{
        
        let fechas = {
            date1:`${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}`,
        }
        console.log(fechas)

        const storedProcedureVentas = new StoredProcedureVentas()

        /* storedProcedureVentas.GetVentasDelDiaTotales(fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setVentaBruta(res.data.total)
                    setVentaNeta(res.data.subTotal)
                    setPropinas(res.data.propina)
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        }) */

        storedProcedureVentas.GetVentasDelDia(fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setVentasD(res.data)
                    let datos = [...res.data]

                    let _efectivo = datos.reduce((acc, el) => el.tipoPago === 1 ? acc + el.total : acc ,0)
                    let _tarjeta  = datos.reduce((acc, el) => el.tipoPago === 2 ? acc + el.total : acc ,0)
                    let _transfe  = datos.reduce((acc, el) => el.tipoPago === 3 ? acc + el.total : acc ,0)
                    let bruta = datos.reduce((acc, el) => acc + el.total,0)
                    let neta = datos.reduce((acc, el) => acc + el.subTotal,0)
                    let propina = datos.reduce((acc, el) => acc + el.propina,0)
                    setVentaBruta(bruta)
                    setVentaNeta(neta)
                    setPropinas(propina)

                    setEfectivo(_efectivo)
                    setTarjeta(_tarjeta)
                    setTransfe(_transfe)
                    
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        });

        storedProcedureVentas.GetVentasEmpleados(fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setVentasEmpleados(res.data)
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }

            }else{
                console.log('Backend Abajo')
            }
        })
        
    },[fecha]);
    
    const lineData = {
        labels: VentasD.map((value) => {

            let _hora = value.hora
            let _tiempo = _hora.split(".")
            return _tiempo[0]

        }),
        datasets: [{
            label: "Ventas",
            data: VentasD.map((value) => value.total),
            fill: true,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66,165,245,0.2)',
            tension: .1,
            pointBackgroundColor:'#42A5F5',
            pointHoverRadius: 6,
            pointHitRadius: 30,        
        }
        ]
    };
    
    const options = {
        maintainAspectRatio:false,
        responsive: true,
        plugins:{
            title: {
              display: true,
              text: 'Ventas del Dia',
              font:{
                size:16
              }
            },
            legend: {
                display:false
            },
            /* tooltip:{
                callbacks:{
                    label: function(value){
                        let valor = value.raw.toLocaleString("es-CL",{style:"currency", currency:"CLP"})
                        let texto = `${value.dataset.label}: ${valor}`
                        return texto ;
                    }

                    footer: function(value){
                        return `${value} dfiugh`
                    }
                }
            } */

           
        },
        scales:{
            y:{
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

    const barData = {
        labels: VentasEmpleados.map((value) => `${value.nombre} ${value.apellido}`),
        datasets: [
            {
                label: "Ventas",
                backgroundColor: 'rgba(66,165,245,0.2)',
                borderColor: '#42A5F5',
                data: VentasEmpleados.map((value) => value.totales),
                
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
                font:{
                    size: 14
                }
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
        let _fechas = {...Fecha};
        _fechas[`${name}`] = val;
        setFecha(_fechas)

        /* await storedProcedureVentas.GetVentasDelDiaTotales(_fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setVentaBruta(res.data.total)
                    setVentaNeta(res.data.subTotal)
                    setPropinas(res.data.propina)
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        }); */
        
        
        await storedProcedureVentas.GetVentasDelDia(_fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setVentasD(res.data)

                    let datos = [...res.data]

                    let _efectivo = datos.reduce((acc, el) => el.tipoPago === 1 ? acc + el.total : acc ,0)
                    let _tarjeta  = datos.reduce((acc, el) => el.tipoPago === 2 ? acc + el.total : acc ,0)
                    let _transfe  = datos.reduce((acc, el) => el.tipoPago === 3 ? acc + el.total : acc ,0)
                    let bruta = datos.reduce((acc, el) => acc + el.total,0)
                    let neta = datos.reduce((acc, el) => acc + el.subTotal,0)
                    let propina = datos.reduce((acc, el) => acc + el.propina,0)
                    setVentaBruta(bruta)
                    setVentaNeta(neta)
                    setPropinas(propina)

                    setEfectivo(_efectivo)
                    setTarjeta(_tarjeta)
                    setTransfe(_transfe)
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        });

        await storedProcedureVentas.GetVentasEmpleados(_fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setVentasEmpleados(res.data)
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }

            }else{
                console.log('Backend Abajo')
            }
        });
        
    }

    const MonedaBodyTemplate = (rowData) => {

        return rowData.totales ? rowData.totales.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits:0}) : '';

    }

    const NombreApellidoTemplate = (rowData) => {
        return `${rowData?.nombre} ${rowData?.apellido}`
    }
    
    return (
        <>

            <div className='p-fluid p-grid ' >

                <div className='p-field'>
                    {/* <label htmlFor="date1">Desde: </label> */}
                    <Calendar id='date1' value={Fecha.date1} dateFormat='dd MM yy' onChange={(e)=>onInputChange(e,'date1')}  showIcon className='p-mr-3' locale='es' />
                </div>

            </div> 

            <div className='p-grid p-d-flex p-mb-2'>

                <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Ventas Totales
                        </h6>
                    </div>
                    <span className='Valores'>{VentaBruta?.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div>

                <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Ventas SubTotales
                        </h6>
                    </div>
                    <span className='Valores'>{VentaNeta?.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div>

                <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Propinas
                        </h6>
                    </div>
                    <span className='Valores'>{Propinas?.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div>

                <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Efectivo
                        </h6>
                    </div>
                    <span className='Valores'>{Efectivo?.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div>

                <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Trajeta
                        </h6>
                    </div>
                    <span className='Valores'>{Tarjeta?.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div>

                {/* <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Transferencia
                        </h6>
                    </div>
                    <span className='Valores'>{Transfe?.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div> */}

            </div>

            

            <div className='p-grid ' >

                <div className='p-card p-col-12 p-mb-6 ' >
                    <Line data={lineData} options={options} height={350}/>
                </div>

                <div className='p-d-flex p-col-12 ' >
                    
                    <div className='p-card p-col-6 p-mr-2' >
                        <DataTable value={VentasEmpleados} header='Detalle Ventas Empleados' responsiveLayout="scroll">
                            <Column  header="Nombre" body={NombreApellidoTemplate}></Column>
                            <Column  header="Total" body={MonedaBodyTemplate} ></Column>
                        </DataTable>
                    </div>

                    <div className='p-card p-col-6'>
                        <Bar data={barData} options={horizontalOptions} />
                    </div>

                    
                    
                </div>

            </div>
        </>
    );
};

export default VentasDelDia;