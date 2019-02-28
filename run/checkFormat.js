const { getAllMovies, format } = require('..');

getAllMovies()
.then(movies => {

    movies.forEach(movie => {
        const m = format(movie);

        if (m.year < 1900 || m.year > 2018) {
            console.log(`wut ${m.title}`);
        }

    });

});
