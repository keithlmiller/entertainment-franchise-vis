export const groupBy = (array, key) => {
    return array.reduce(function(newObj, obj) {
        (newObj[obj[key]] = newObj[obj[key]] || []).push(obj);
        return newObj;
    }, {});
};

export const getMoviesInRange = (range, data, property) => {
    if (!range.length) {
        return data;
    }
    const [min, max] = range;
    const moviesInRange = data.filter((movie) => (movie[property] > min && movie[property] < max));

    return moviesInRange;
}

export const filterPropertyNonNumbers = (array, property) => array.filter((d) => !isNaN(d[property]))

export const sortByPropertyAsc = (data, property) => data.sort((a, b) => b[property] - a[property]);

export const sortByPropertyDesc = (data, property) => data.sort((a, b) => a[property] - b[property]);

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

export const fillRange = ([start, end]) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}