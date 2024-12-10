module.exports = function(filteredObject, ignoredKeys){
    return Object.keys(filteredObject).forEach(key => (filteredObject[key] === undefined || ignoredKeys.includes(key)) && delete filteredObject[key])

}