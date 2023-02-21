import React, {useState, useEffect, useMemo} from 'react';
import {Calendar} from 'primereact/calendar'
import { addLocale } from 'primereact/api';
import StoredProcedureVentas from '../../service/InformeService/StoredProcedureVentas'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  import { Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const ResumenVentas = () => {
    
    let fecha =  useMemo(() => {
        let date = new Date()
        date.setDate(date.getDate()-30)
        
        return date
    },[]);

    let fecha1 = useMemo(() => {
        let date1 = new Date()
        console.log(date1)
        return date1
    },[])


    const emptyFecha = {
        date1:fecha,
        date2:fecha1
    }

    const [RangoFecha, setRangoFecha] = useState(emptyFecha)
    const [SubTotalVentas, setSubTotalVentas] = useState([])
    const [VentaBruta, setVentaBruta] = useState(0)
    const [VentaNeta, setVentaNeta] = useState(0)
    const [Propinas , setPropinas] = useState(0)
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
            date2:`${fecha1.getFullYear()}-${fecha1.getMonth()+1}-${fecha1.getDate()}` 
        }
        console.log(fechas)
        console.log('useEfect')
        const storedProcedureVentas = new StoredProcedureVentas()
        storedProcedureVentas.GetVentasSubTotales(fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    console.log(res.data)
                    setSubTotalVentas(res.data)

                    let bruta = res.data.reduce((acc, el) => acc + el.total,0)
                    let neta = res.data.reduce((acc, el) => acc + el.subTotal,0)
                    let propina = res.data.reduce((acc, el) => acc + el.propina,0)
                    setVentaBruta(bruta)
                    setVentaNeta(neta)
                    setPropinas(propina)

                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        })
        
    },[fecha, fecha1]);
    
    const lineData = {
        labels: SubTotalVentas.map((value) => {
            let _date = new Date(value.fecha)
            return _date.toLocaleDateString('es-CL',{month:'short', day:'numeric'})
        }),
        datasets: [
            {
            label: 'Ventas Totales' /* "Ventas Brutas" */,
            data: SubTotalVentas.map((value) => value.total),
            fill: true,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66,165,245,0.2)',
            tension: .1,
            pointBackgroundColor:'#42A5F5',
            pointHoverRadius: 6,
            pointHitRadius: 30,        
            },{
                label: 'Ventas Subtotales'/* "Ventas Netas" */,
                data: SubTotalVentas.map((value) => value.subTotal),
                fill: true,
                borderColor: '#FFA726',
                backgroundColor: 'rgba(255,167,38,0.2)',
                pointBackgroundColor:'#FFA726',
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
              text: 'Resumen de Ventas',
              fontSize: 16
            },
            legend: {
                display:true
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
    

    const onInputChange = async(e, name) => {
        
        const val = (e.target && e.target.value) || '';
        let _rangoFecha = {...RangoFecha};
        _rangoFecha[`${name}`] = val;
        setRangoFecha(_rangoFecha)
        
        await storedProcedureVentas.GetVentasSubTotales(_rangoFecha).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    console.log(res.data)
                    setSubTotalVentas(res.data)

                    let bruta = res.data.reduce((acc, el) => acc + el.total,0)
                    let neta = res.data.reduce((acc, el) => acc + el.subTotal,0)
                    let propina = res.data.reduce((acc, el) => acc + el.propina,0)
                    setVentaBruta(bruta)
                    setVentaNeta(neta)
                    setPropinas(propina)
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

            <div className='p-fluid p-grid ' >

                <div className='p-field'>
                    {/* <label htmlFor="date1">Desde: </label> */}
                    <Calendar id='date1' value={RangoFecha.date1} dateFormat='dd MM yy' onChange={(e)=>onInputChange(e,'date1')}  showIcon className='p-mr-3' locale='es' />
                </div>

                <div className='p-field'>
                    {/* <label htmlFor="date2"> Hasta: </label> */}
                    <Calendar id='date2' value={RangoFecha.date2} dateFormat='dd MM yy' onChange={(e)=>onInputChange(e,'date2')} showIcon locale='es'/>
                </div>

            </div> 

            <div className='p-grid p-d-flex p-mb-2'>

                <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Ventas Totales
                        </h6>
                    </div>
                    <span className='Valores'>{VentaBruta.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div>

                <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Ventas SubTotales
                        </h6>
                    </div>
                    <span className='Valores'>{VentaNeta.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div>

                <div className='p-card contenedor'>
                    <div>
                        <h6 className='TituloVentas'>
                            Propinas
                        </h6>
                    </div>
                    <span className='Valores'>{Propinas.toLocaleString("es-CL",{style:"currency", currency:"CLP"})}</span>
                </div>

            </div>
            <div className='p-grid p-card ' >
                <div className='p-col-12  ' >
                    <Line data={lineData} options={options} height={350}/>
                </div>

            </div>
        </>
    );
};

export default ResumenVentas;
