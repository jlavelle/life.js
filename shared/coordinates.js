function Point(x, y) {
    return {x, y}
}

const getCoordinatesOfIndex = size => i => {
    return Point(Math.floor(i / size), i % size)
}

const getIndexOfCoordinates = size => ({x, y}) => {
    return x * size + y
}

export { Point, getCoordinatesOfIndex, getIndexOfCoordinates }
