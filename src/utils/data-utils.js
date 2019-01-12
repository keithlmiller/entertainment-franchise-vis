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
    return data.sort((a, b) => b[property] - a[property])
}