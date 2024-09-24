import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

function clearOutput() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function renderCountryList(countries) {
    const markup = countries
        .map(
            (country) => `<li>
                <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="50">
                <span>${country.name.official}</span>
            </li>`
        )
        .join('');
    countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
    const languages = Object.values(country.languages).join(', ');
    const markup = `
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="100">
        <h2>${country.name.official}</h2>
        <p><b>Capital:</b> ${country.capital}</p>
        <p><b>Population:</b> ${country.population}</p>
        <p><b>Languages:</b> ${languages}</p>
    `;
    countryInfo.innerHTML = markup;
}

function handleCountriesResponse(countries) {
    if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }

    if (countries.length > 1 && countries.length <= 10) {
        renderCountryList(countries);
    } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
    }
}

function onSearch(event) {
    const query = event.target.value.trim();
    
    if (query === '') {
        clearOutput();
        return;
    }
    
    fetchCountries(query)
        .then(handleCountriesResponse)
        .catch((error) => {
            if (error.message === '404') {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            } else {
                console.error(error);
            }
        });
}

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
