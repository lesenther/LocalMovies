const fs = require('fs');
const { extname, join } = require('path');

const glob = require('glob');

const VALID_MOVIE_EXTENSIONS = 'mkv|mp4|avi|m2ts|mpg|divx|m4v'.split('|');
const DEFAULT_DIR = `D:\\__Movies`;

global.config = {
    query: false,
    exclude: false
};

/**
 *
 * @param {*} path
 */
function getAllFiles(path = DEFAULT_DIR) {
    return new Promise((resolve, reject) => {
        glob(join(path, '**/*'), (err, results) => {
            if (err) {
                return reject(err);
            }

            return resolve(results);
        });
    }).then(results => results.filter(file => fs.statSync(file).isFile()));
}

function filterQuery(file) {
    return (!global.config.query || file.toLowerCase().indexOf(global.config.query.toLowerCase()) !== -1);
}

function filterExclude(file) {
    return (!global.config.exclude || file.toLowerCase().indexOf(global.config.exclude.toLowerCase()) === -1);
}

/**
 * Get movies in a certain path
 *
 * @param {String} path
 */
function getAllMovies(path = DEFAULT_DIR) {
    return getAllFiles(path)
    .then(files => files.filter(isValidMovieFile));
}

/**
 *
 */
function getMovieFileTypeDistribution(){
    return getAllMovies()
    .then(movies => {
        const dist = [];

        movies.forEach(movie => {
            filetype = extname(movie).substr(1).toLowerCase();
            if (dist[filetype]) {
                dist[filetype] = dist[filetype] + 1;
            } else {
                dist[filetype] = 1;
            }
        });

        return dist;
    });
}

/**
 * 
 * @param {*} path 
 */
function getRandomMovie(path = DEFAULT_DIR, opts = {}) {
    setOpts(opts);
    return getAllMovies(path)
    .then(files => files.filter(filterQuery))
    .then(files => files.filter(filterExclude))
    .then(movies => {
        return movies.length
        ? format(movies[Math.floor(Math.random(0) * movies.length)])
        : false;
    });
}

function setOpts(opts = {}) {
    global.config = opts;
}

/**
 * Take the string containing the movie path and return an object with better organized information.
 * 
 * TODO:  Pull data from IMDB, other movie APIs
 * 
 * @param {*} path
 */
function format(path = '') {
    if (!path || typeof path !== 'string' || !path.length) {
        throw new Error(`Bad input:  ${path}`);
    }

    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    const title = filename.substr(0, filename.indexOf(' ['));
    const genre = parts[parts.length - 2];
    const year = filename.split('[').length > 1 ? filename.split('[')[1].split(']')[0] : '';
    const filetype = extname(filename).substr(1);
    const notes = filename.split(']').length > 1 ? filename.split(']')[1].replace(`.${filetype}`, '').trim() : '';
    const titles = (genre === 'Foreign' && filename.substr(') [') !== -1)
    ? title.replace(')', '').trim().split(' (')
    : [];

    return { title, genre, year, filetype, notes, path, titles };
}

/**
 * 
 * @param {*} file
 */
function isValidMovieFile(file) {
    const ext = extname(file).substr(1).toLowerCase();

    return VALID_MOVIE_EXTENSIONS.indexOf(ext) !== -1;
}

module.exports = {
    getAllFiles,
    getAllMovies,
    isValidMovieFile,
    getRandomMovie,
    format,
    getMovieFileTypeDistribution
};
