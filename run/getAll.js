const { getAllMovies } = require('..');

getAllMovies()
.then(movies => {
    console.log(movies.length);
});
