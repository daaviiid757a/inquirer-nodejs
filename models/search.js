const fs = require('fs');
const axios = require('axios');

class Search {
    history = [];
    dbPath = './db/places.json';

    constructor() {
        this.readDB()
    }

    async city(city = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
                params: {
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5,
                    'language': 'es',
                }
            });

            const { data } = await instance.get();

            return data.features.map(c => ({
                id: c.id,
                name: c.place_name,
                lng: c.center[0],
                lat: c.center[1],
            }));
        } catch (error){
            return [];
        }

    }

    async weather(lat, lon) {

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat,
                    lon,
                    'appid': process.env.OPENWEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es',
                }
            });
    
            const { data } = await instance.get();
            
            return {
                temp: data.main.temp,
                min: data.main.temp_min,
                max: data.main.temp_max,
                desc: data.weather[0].description
            };
        } catch (error) {
            return [];
        }

    }

    async saveHistory(place = '') {
        if (this.history.includes(place.toLocaleLowerCase())) return;

        this.history.unshift(place);
        this.saveDB();
    }

    async saveDB(place = '') {
        const payload = { history: this.history };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    async readDB(place = '') {
        if (!fs.existsSync(this.dbPath)) return;

        const file = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const places = JSON.parse(file);

        this.history = places.history;
    }
}

module.exports = {
    Search,
} 