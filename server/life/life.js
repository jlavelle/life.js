import { Point, getCoordinatesOfIndex, getIndexOfCoordinates } from '../../shared/coordinates'
import { SetGrid } from '../../shared/grid'
import { sequence } from 'ramda'

function Ruleset(born, survives) {
    return (alive, neighbors) => {
        if (!alive) {
            //return any(equals(neighbors), born)
            return born.reduce((acc, x) => acc || x == neighbors, false)
        }
        if (alive) {
            return survives.reduce((acc, x) => acc || x == neighbors, false)
        }
        return false
    }
}

const gameOfLife = Ruleset([3], [2, 3])
const highLife = Ruleset([3, 6], [2, 3])

function precomputeStates() {

}

function fastLife(alive, neighbors) {
    if(alive) {
        return neighbors === 2 || neighbors === 3
    } else {
        return neighbors === 3
    }
}

export function game(gridType) {
    return function (n) {
        const getCoordinates = getCoordinatesOfIndex(n)
        const getIndex = getIndexOfCoordinates(n)

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
            ]
            return neighbors.filter(pair => {
                return inBounds(pair[0], pair[1]) && cells.alive(n * pair[0] + pair[1])
            }).length
        }

        function inBounds(x, y) {
            const size = n * n
            return (x >= 0 && x < size) && (y >= 0 && y < size)
        }

        function checkForLife(cellState, point, cells) {
            const neighbors = liveNeighbors(point, cells)
            return fastLife(cellState, neighbors)
        }

        return function update(grid) {
            const nextGrid = gridType()
            for (var i = 0; i < n * n; i++) {
                const point = getCoordinates(i)
                const nextState = checkForLife(grid.alive(i), point, grid)
                if (nextState) nextGrid.birth(i)
            }
            return nextGrid
        }
    }
}