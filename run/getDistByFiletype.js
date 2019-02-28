const { getMovieFileTypeDistribution } = require('..');

const BucketContainer = require('../../BasicDataAnalysis');

getMovieFileTypeDistribution()
.then(dist => {
    const buckets = new BucketContainer(dist);
    const scaleY = 10 / buckets.getMaxSize();
    console.log(buckets.getIds());
    buckets.sortById();
    buckets.printVertical({ scaleY }).forEach(line => {
        console.log(line);
    });
});
