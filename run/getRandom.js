const { getRandomMovie } = require('..');
const queryMovieDb = require('../moviesApi');

var argv = require('minimist')(process.argv.slice(2), {
    alias: { q: 'query', e: 'exclude' }
});

getRandomMovie(undefined, { query: argv.q, exclude: argv.e })
.then(movie => {
    if (movie) {
        console.log(`You should watch`, movie);

        queryMovieDb(movie.title, movie.year)
        .then(movieApi => {
            console.log(movieApi.plot);
        })
        .catch(err => console.log(err))
    } else {
        console.log(`Nothing meets your criteria.`);
    }
});
