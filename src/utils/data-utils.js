export const groupBy = (array, key) => {
    return array.reduce(function(newObj, obj) {
        (newObj[obj[key]] = newObj[obj[key]] || []).push(obj);
        return newObj;
    }, {});
};
