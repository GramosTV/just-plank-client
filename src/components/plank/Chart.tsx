import React from 'react';
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
import faker from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


  
  export function Chart(props: any) {
    const {axisTitle, days, chartData, label } = props.props
    const options = {
      scales: {
        y: {
          max: label === 'Weight' ? Math.ceil([...chartData].sort((a: any,b: any)=>a-b).reverse()[0] / 1) * 1 + 1 : Math.ceil([...chartData].sort((a: any,b: any)=>a-b).reverse()[0] / 5) * 5 + 5,
          min: label === 'Weight' ? Math.ceil([...chartData].sort((a: any,b: any)=>a-b)[0] / 1) * 1 - 1 : 
          ((Math.ceil([...chartData].sort((a: any,b: any)=>a-b)[0] / 5) * 5 - 5) < 0 ? 0 : (Math.ceil([...chartData].sort((a: any,b: any)=>a-b)[0] / 5) * 5 - 5)),
          title: {
            display: true,
            text: axisTitle
          }
        },
      //   x: {
      //     title: {
      //       display: true,
      //       text: 'X axis title'
      //     }
      //   }
      },
      responsive: true,
      plugins: { 
        legend: {
          display: false,
          position: 'top' as const,
        },  
        title: {display: false,
            text: 'Chart.js Line Chart',
          },
        },
      };
      
      const labels = days;
      
      const data = {
        labels,
        datasets: [
          {
            label,
            data: chartData,
            borderColor: '#75c9b7',
            backgroundColor: '$text-color',
            spanGaps: true,
          }
        ],
      };
    return <div className="chart"><Line options={options} data={data} /></div> ;
}