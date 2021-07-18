const initialDate = document.getElementById('date_start')
const finalDate = document.getElementById('date_end')
const selectCountryInput = document.getElementById("cmbCountry");

const kpiconfirmed = document.getElementById('kpiconfirmed')
const kpideaths = document.getElementById('kpideaths')
const kpirecovered = document.getElementById('kpirecovered')

const baseUrl = "https://api.covid19api.com";

var ctx = document.getElementById('linhas').getContext('2d');

var myChart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{
          data: [],
          fill: false,
          borderColor: 'rgb(0, 0, 192)',
          tension: 0.1
      },
      {
        data: [],
        fill: false,
        borderColor: 'rgb(255, 0, 0)',
        tension: 0.1
    },
    ]
  },
  options: {
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }
});

const renderGraph = (date, number, mean, typeSelected) => {
  myChart.data.labels = date
  myChart.data.datasets[0].data = number
  myChart.data.datasets[0].label = `Número de ${typeSelected}`
  myChart.data.datasets[1].data = mean
  myChart.data.datasets[1].label = `Média de ${typeSelected}`

  myChart.update()
}

async function renderCountries() {}

async function renderCountryCombo() {
  response = await axios.get(`${baseUrl}/countries`);

  const countries = _.sortBy(response.data, ['Country']);

  for (const country of countries) {
    const option = document.createElement("option");
    option.textContent = country.Country;
    option.value = country.Slug;

    if(country.Slug == 'brazil') {
      option.selected = true;
    }
    
    selectCountryInput.appendChild(option);
  }
}

function initializeInputs() {
  initialDate.value = '2021-05-01';
  finalDate.value = '2021-05-24';
  selectCountryInput.value = 'brazil'
}

renderCountryCombo();
setTimeout(initializeInputs, 500)
setTimeout(listByCountryAllStatus, 1000)


async function listByCountryAllStatus() {
  const firstDate = new Date(new Date(initialDate.value).setDate(new Date(initialDate.value).getDate() - 1)).toISOString();
  const lastDate = new Date(new Date(finalDate.value).setDate(new Date(finalDate.value).getDate() + 1)).toISOString();

  const response = await axios.get(`${baseUrl}/country/${selectCountryInput.value}?from=${firstDate}&to=${lastDate}`);

  const info = response.data

  kpiconfirmed.innerText = info[info.length - 2]['Confirmed'].toLocaleString('pt-BR')
  kpideaths.innerText = info[info.length - 2]['Deaths'].toLocaleString('pt-BR')
  kpirecovered.innerText = info[info.length - 2]['Recovered'].toLocaleString('pt-BR')

  const dailyDeaths = []
  const dailyConfirmed = []
  const dailyRecovered = []
  const meanDeaths = []
  const meanRecovered = []
  const meanConfirmed = []

  for(let i = 0; i < info.length - 2; i++) {
    dailyDeaths.push(info[i + 1].Deaths - info[i].Deaths)
    dailyConfirmed.push(info[i + 1].Confirmed - info[i].Confirmed)
    dailyRecovered.push(info[i + 1].Recovered - info[i].Recovered)
  }

  for(let i = 0; i < info.length - 2; i++) {
    meanDeaths.push(_.mean(dailyDeaths));
    meanRecovered.push(_.mean(dailyRecovered));
    meanConfirmed.push(_.mean(dailyConfirmed));
  }

  let dailyInformation = ''
  let dailyMean = ''
  let label = ''

  const selectorType = document.getElementById('cmbData')

  const typeSelected = selectorType.value

  switch (typeSelected) {
    case 'Confirmed':
      dailyInformation = dailyConfirmed
      dailyMean = meanConfirmed
      label = 'confirmados'
      break;
    
    case 'Recovered':
      dailyInformation = dailyRecovered
      dailyMean = meanRecovered
      label = 'recuperados'
      break;

    case 'Deaths':
      dailyInformation = dailyDeaths
      dailyMean = meanDeaths
      label = 'mortes'
      break;
  
    default:
      break;
  }

  const dates = response.data.map(item => item.Date)

  dates.splice(0, 1);

  renderGraph(dates, dailyInformation, dailyMean, label)
  
}
