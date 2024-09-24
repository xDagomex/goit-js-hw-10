export const fetchCountries = (name) => {
    const fields = 'name,capital,population,flags,languages';
    const url = `https://restcountries.com/v3.1/name/${name}?fields=${fields}`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .catch(error => {
            throw error;
        });
};
