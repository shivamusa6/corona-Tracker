import axios from 'axios';

const url = 'https://covid19.mathdro.id/api';

export const fetchData = async (country) => {
  const changeableUrl = url;

  if (country) {
    const confirmedUrl = `https://api.covid19api.com/total/country/${country}/status/confirmed`;
    const recoveredUrl = `https://api.covid19api.com/total/country/${country}/status/recovered`;
    const deathsUrl = `https://api.covid19api.com/total/country/${country}/status/deaths`;
    let dataConfirmed = await axios.get(confirmedUrl);
    let dataRecovered = await axios.get(recoveredUrl);
    let dataDeaths = await axios.get(deathsUrl);
    dataConfirmed = dataConfirmed.data.map(({ Cases, Date }) => ({ Cases, Date }));
    dataRecovered = dataRecovered.data.map(({ Cases }) => ({ Cases }));
    dataDeaths = dataDeaths.data.map(({ Cases }) => ({ Cases }));

    const data = [];
    for (let i = 0; i < dataConfirmed.length; i++) {
      const temp = {
        confirmed: dataConfirmed[i].Cases,
        deaths: dataDeaths[i].Cases,
        date: new Date(dataConfirmed[i].Date).toDateString(),
        recovered: dataRecovered[i].Cases,
      };
      data.push(temp);
    }
    return data;
  }

  try {
    const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get(changeableUrl);

    return { confirmed, recovered, deaths, lastUpdate };
  } catch (error) {
    return error;
  }
};

export const fetchDailyData = async () => {
  try {
    const { data } = await axios.get(`${url}/daily`);

    return data.map(({ confirmed, deaths, reportDate: date }) => ({ confirmed: confirmed.total, deaths: deaths.total, date }));
  } catch (error) {
    return error;
  }
};

export const fetchCountries = async () => {
  try {
    const { data: { countries } } = await axios.get(`${url}/countries`);

    return countries.map((country) => country.name);
  } catch (error) {
    return error;
  }
};
