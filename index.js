require('dotenv').config();

const { menu, pause, readInput, listPlaces } = require('./helpers/inquirer');
const { Search } = require('./models/search');

const main = async () => {
    let opt = "";
    const search = new Search();

    do {
        opt = await menu();

        switch(opt) {
            case 1:
                // Show message
                const city = await readInput("Ciudad: ");

                // Search place
                const places = await search.city(city);

                // Select place
                const id = await listPlaces(places);
                if (id === '0') continue;
                const { name, lat, lng } = places.find(p => p.id = id );

                // Save to DB
                search.saveHistory(name);

                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', name );
                console.log('Lat:', lat );
                console.log('Lng:', lng );

                const { min, max, temp, desc } = await search.weather(lat, lng);

                console.log('Temperatura:', temp );
                console.log('Mínima:', min );
                console.log('Máxima:', max );
                console.log('Como está el clima:',  desc.green );
                break;
            case 2:
                search.history.forEach((p, i) => {
                    const idx = `${i + 1}.`.green;

                    console.log(`${i + 1}. ${p}`);
                })
                break;
        }

        if (opt !== 0) await pause();

    } while(opt !== 0);
}

main();