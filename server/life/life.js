// need a life object
// it needs to expose a step function that returns a set of cells to update
// it needs to expose a function that can add cells to the set of updates (use input)
// expose a function that creates a grid
import { Point, getCoordinatesOfIndex, getIndexOfCoordinates } from '../../shared/coordinates'

function game(n) {
    function liveNeighbors({ x, y }, cells) {
        const neighbors = [
            [x - 1, y - 1],
            [x, y - 1],
            [x + 1, y - 1],
            [x - 1, y],
            [x + 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1]
        ];
        return neighbors.filter(pair => {
            const [x, y] = pair
            return cells[n * x + y] && inBounds(x, y)
        }).length;
    }

    function inBounds(x, y) {
        const size = n * n;
        return (x >= 0 && x < size) && (y >= 0 && y < size)
    }

    function checkForLife(cellState, point, cells) {
        const neighbors = liveNeighbors(point, cells)
        if (cellState && (neighbors === 2 || neighbors === 3)) return true
        if (!cellState && (neighbors === 3)) return true
        return false
    }

    return function update(cells) {
        const dirty = new Set()
        const cells = Object.freeze(cells)
        for (var i = 0; i < n * n; i++) {
            const point = getCoordinates(i)
            const nextState = checkForLife(cells[i], point, cells)
            if (cells[i] !== nextState) dirty.add(i)
        }
        return dirty
    }
}

// the size of the grid
const n = 100
let paused = false

const getCoordinates = getCoordinatesOfIndex(n)
const getIndex = getIndexOfCoordinates(n)


const cells = new Array(n * n).fill(0).map(() => {
    var r = Math.random()
    return Math.round(r)
})



export function evolve() {
    if (!paused) {
        for (var i = 0; i < n * n; i++) {
            const point = getCoordinates(i)
            const nextState = checkForLife(cells[i], point)
            if (cells[i] !== nextState) dirty.add(i)
        }
    }
}

export function update() {
    const updateData = renderDataToJSON()
    dirty.forEach(i => cells[i] = !cells[i])
    dirty.clear()
    return updateData
}

export function renderDataToJSON() {
    return JSON.stringify({
        cells
    })
}

export function togglePause() {
    paused = !paused
}

export function applyInteraction(interactionEvent) {
    console.log(interactionEvent)
    const event = JSON.parse(interactionEvent)
    if (cells[event.index] === event.erasing) dirty.add(event.index)
}