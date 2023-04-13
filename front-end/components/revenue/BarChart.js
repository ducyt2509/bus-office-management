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

function App() {
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
        data: [10, 20, 30, 42, 51, 82, 31, 59, 61, 73, 91, 58],
        backgroundColor: color,
        // borderColor: '#F26A4C',
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
    setData({
      labels: ['Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Doanh Thu',
          data: [0, 30, 10],
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
  }, []);
  return (
    <div className="App">
      <Line data={data} id="bom-chart">
        Hello
      </Line>
    </div>
  );
}

export default App;
