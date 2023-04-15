import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js';
ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

export default function BarChart(props) {
  const [color, setColor] = useState();
  const [data, setData] = useState({
    labels: [
      'Jan',
      'Feb',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'First Dataset',
        data: [],
        backgroundColor: color,
        tension: 0.4,
        fill: true,
        pointStyle: 'rect',
        pointBorderColor: 'blue',
        pointBackgroundColor: '#fff',
        showLine: true,
      },
    ],
  });
  useEffect(() => {
    var ctx = document.getElementById('bom-chart').getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#F26A4C');
    gradient.addColorStop(1, 'rgba(250,174,50,0)');
    let labels = [];
    let date = new Date();
    if (props.report == '2') {
      labels = ['Mon', 'Tue', 'Weds', 'Thurs', 'Fri', 'Sat', 'Sun'];
    } else if (props.report == '3') {
      for (let i = 1; i < 31; i++) {
        if (i == 1) {
          labels.push(`0${i}/${date.getMonth() + 1}/${date.getFullYear()}`);
        } else if (i == 10) {
          labels.push(`${i}/${date.getMonth() + 1}/${date.getFullYear()}`);
        } else if (i == 20) {
          labels.push(`${i}/${date.getMonth() + 1}/${date.getFullYear()}`);
        } else if (i == 30) {
          labels.push(`${i}/${date.getMonth() + 1}/${date.getFullYear()}`);
        } else {
          labels.push('');
        }
      }
    } else if (props.report == '4') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    setData({
      labels: labels,
      datasets: [
        {
          label: 'Doanh Thu',
          data: props.revenueData,
          backgroundColor: gradient,
          borderColor: '#f58f78',
          tension: 0.4,
          fill: true,
          pointStyle: 'circle',
          pointBorderColor: '#F26A4C',
          pointBackgroundColor: '#F26A4C',
          showLine: true,
        },
      ],
    });
  }, [props.report, props.revenueData]);
  return (
    <div className="App">
      <Line data={data} id="bom-chart" />
    </div>
  );
}
