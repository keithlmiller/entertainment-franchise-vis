export const groupBy = (array, key) => {
    return array.reduce(function(newObj, obj) {
        (newObj[obj[key]] = newObj[obj[key]] || []).push(obj);
        return newObj;
    }, {});
};

export const getMoviesInRange = (range, data, property) => {
    const [min, max] = range;
    const moviesInRange = data.filter((movie) => (movie[property] > min && movie[property] < max));

    return moviesInRange;
}

export const getTopByProperty = (data, property) => {
    return data.sort((a, b) => b[property] - a[property]);
}

export const getRandIndex = (boxOfficeData, numMovies) => Math.floor(Math.random() * Math.floor(boxOfficeData.length - numMovies));

export const getFirstX = (boxOfficeData, numMovies) => boxOfficeData.slice(0, numMovies);

export const getRandXAdjacent = (boxOfficeData, numMovies) => {
    const startingPoint = getRandIndex(boxOfficeData, numMovies);
    return boxOfficeData.slice(startingPoint, startingPoint + numMovies);
}

export const getRandX = (boxOfficeData, numMovies) => {
    let randMovies = [];
    for (let i=0; i<numMovies; i++) {
        const movieIndex = getRandIndex(boxOfficeData, 1);
        randMovies.push(boxOfficeData[movieIndex]);
    }
    return randMovies;
}