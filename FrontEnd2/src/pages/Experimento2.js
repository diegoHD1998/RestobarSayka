import React from 'react';
import { Chart } from 'primereact/chart';

const Experimento2 = () => {

    const datos = [
        {fecha:'2021-11-01', subTotal:20500},
        {fecha:'2021-11-01', subTotal:30500},
        {fecha:'2021-11-01', subTotal:40500},
        {fecha:'2021-11-01', subTotal:10500},
        {fecha:'2021-11-01', subTotal:20500},
        {fecha:'2021-11-01', subTotal:50500},
        {fecha:'2021-11-01', subTotal:60500},
    ]

    const lineData = {
        labels: datos.map(value => value.fecha),
        datasets:[{
            data: datos,
            parsing:{
                yAxisKey:'subTotal'
            }
        }]
    }

    const options ={
        
    }

    return (
        <div>
            <Chart type="line" data={lineData} options={options}/>
        </div>
    );
};

export default Experimento2;