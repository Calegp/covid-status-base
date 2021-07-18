const baseUrl = "https://api.covid19api.com";

function listCountries() {
  return axios.get(`${baseUrl}/countries`);
}

function listGlobalNumbers() {
  return axios.get(`${baseUrl}/summary`);
}

function listByCountryAllStatus(country, initialDate, finalDate) {
  return axios.get(`${baseUrl}/country/${country}?from=${initialDate}&to=${finalDate}`);
}

function renderCountries() {
  countries = listCountries();

  countries.sort(function (a, b) {
    return (a.Country > b.Country) ? 1 : ((b.Country > a.Country) ? -1 : 0);
  });

  for (const country of countries) {
    const option = document.createElement("option");
    option.textContent = country.Country;
    option.value = country.Slug;

    const selectCountryInput = document.getElementById("cmbCountry");
    
    selectCountryInput.appendChild(option);
  }
}