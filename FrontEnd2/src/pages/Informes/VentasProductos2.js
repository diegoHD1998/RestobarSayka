import React, {useState, useEffect, useMemo} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Calendar} from 'primereact/calendar'
import { addLocale } from 'primereact/api';
import StoredProcedureVentas from '../../service/InformeService/StoredProcedureVentas'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);


const VentasProductos2 = () => {

    let fecha =  useMemo(() => {
        let date = new Date()
        //date.setDate(date.getDate()-30)
        return date
    },[]);

    let fecha1 = useMemo(() => {
        let date1 = new Date()
        return date1
    },[])

    const emptyFecha = {
        date1:fecha,
        date2:fecha1
    }

    const [RangoFecha, setRangoFecha] = useState(emptyFecha)
    const [VentasProducto, setVentasProducto] = useState([])
    const [VentasProductosTop6, setVentasProductosTop6] = useState([])
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
        
        const storedProcedureVentas = new StoredProcedureVentas()
        storedProcedureVentas.GetVentasProductoSpecific(fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    
                    setVentasProducto(res.data)
                    console.log(res.data)

                    let top6 = res.data.splice(0,5)
                    setVentasProductosTop6(top6)
                    
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        })
        
    },[fecha, fecha1]);
    
    const basicData = {
        labels: VentasProductosTop6.map(value => `${value.nombre} ${value.nombreReferencia} $${value.total}`),
        datasets: [{
            label: "Top #10 Productos mas vendidos",
            data: VentasProductosTop6.map((value) => value.cantidad),
            fill: true,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(50, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(50, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,    
              
        }
        ]
    };
    
    const options = {
        //maintainAspectRatio:false,
        responsive: true,
        //radius:90,
        plugins: {
            title: {
                display: true,
                text: "Ventas por Producto",
            },
            legend: {
                display:true,
                position:'left',
                boxWidth: 60,
                labels:{
                    boxWidth:10,
                    borderRadius:'10px'
                }
                
            },
             
        },
         
         
        
    };
    

    const onInputChange = async(e, name) => {
        
        const val = (e.target && e.target.value) || '';
        let _rangoFecha = {...RangoFecha};
        _rangoFecha[`${name}`] = val;
        setRangoFecha(_rangoFecha)
        
        await storedProcedureVentas.GetVentasProductoSpecific(_rangoFecha).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){

                    setVentasProducto(res.data)
                    
                    let datos = [...res.data]
                    let top6 = datos.splice(0,5)
                    setVentasProductosTop6(top6)

                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        })
        
    }

    const MonedaBodyTemplate = (rowData) => {

        return rowData.total ? rowData.total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits:0}) : '';

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

            <div className='p-grid ' >

                <div className=' p-col-12 p-md-6 ' >
                    <div className='p-col-12 p-md-12 p-card ' >
                        <Pie data={basicData} options={options} />
                    </div>
                </div>

                <div className='p-col-12 p-md-6 ' >
                    
                    <DataTable value={VentasProducto} header='Detalle Ventas por Producto' responsiveLayout="scroll">
                        <Column field="nombre" header="Nombre"></Column>
                        <Column field='nombreReferencia'></Column>
                        <Column field="cantidad" header="Cantidad" ></Column>
                        <Column field="total" header="Total Vendidos"  body={MonedaBodyTemplate}></Column>
                    </DataTable>
                    
                </div>

            </div>
        </>
    );
};

export default VentasProductos2;

