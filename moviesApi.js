const fs = require('fs');

const imdb = require('imdb-api');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const DB_FILENAME = 'db.json';
const API_KEY = require('./private/imdb.json').apiKey;

const adapter = new FileSync(DB_FILENAME)
const db = low(adapter)

/**
 *
 * @param {*} movie
 */
function addLocalDb(movie, force = false) {
    if (!movie) {
        return false;
    }

    if (movie.constructor.name !== 'Movie') {
        throw new Error('Bad input format!');
    }

    const movieExists = searchLocalDb({
        title: movie.title,
        year: movie.year
    });

    // Search before adding
    if (movieExists && !force) {
        return movieExists;
    }

    return db.get('movies')
    .push(movie)
    .write();
}

/**
 *
 * @param {*} term
 */
function searchLocalDb(term) {
    return db.get('movies')
    .find(term)
    .value();
}

/**
 * Use Omdb to query movie data.
 *
 * @param {*} name
 */
function queryMovieDb(name) {
    return imdb.get({
        name
    }, {
        apiKey: API_KEY,
        timeout: 30000
    })
    .catch(err => {
        console.log(`Error:  ${err.message}`);
        return false;
    });
}

/**
 *
 * @param {*} title
 * @param {*} year 
 */
function getMovie(title, year) {
    return new Promise((resolve, reject) => {
        const result = searchLocalDb({ title, year });

        if (result) {
            return resolve(result);
        } else {
            return queryMovieDb(`${title}`)
            .then(movie => {
                addLocalDb(movie);
                return resolve(movie);
            })
            .catch(err => {
                console.log(`Error:  ${err.message}`);''
            });
        }
    });
}

/**
 *
 */
(function init(){
    if (!fs.existsSync(DB_FILENAME)) {
        db.defaults({ movies: [] })
        .write();
    }
})();

module.exports = getMovie;
