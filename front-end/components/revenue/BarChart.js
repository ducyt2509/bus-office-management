import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);
const BarChart = () => {
    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Thống kê doanh thu',
                font: {
                    size: 30
                }
            },
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            }
        },
    };
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
            {
                data: [1, 20, 3, 4, 5, 6, 7],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },

        ],
    };

    return (
        <div style={{
        }}>
            <Bar style={{ width: "100%" }} options={options} data={data} />
        </div >
    );
};

export default BarChart;