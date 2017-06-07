/*
    Grid abstraction so that we can test the performance of
    different structures
*/

function until (cond, action) {
    let status = cond()
    while(!status) {
        action()
        status = cond()
    }
}

export function SetGrid(newCells) {
    const cells = newCells || new Set()

    function alive(index) {
        return cells.has(index)
    }

    function birth(index) {
        cells.add(index)
    }

    function kill(index) {
        cells.delete(index)
    }

    function toSerializable() {
        return [...cells]
    }

    return {
        alive,
        birth,
        kill,
        toSerializable,
        get size() {
            return cells.size
        }
    }
}

SetGrid.of = function(idxArray) {
    return SetGrid(new Set([...idxArray]))
}

SetGrid.randomCells = function (size, density) {
    const result = SetGrid()
    const fullEnough = () => result.size >= ((size * size) * density)
    until(fullEnough, () => result.birth(Math.floor((size * size) * Math.random())))
    return result
}

SetGrid.toString = () => 'SetGrid'

export function ArrayGrid(newCells) {
        let cells = newCells || new Array()

        function alive(index) {
            return cells[index]
        }

        function birth(index) {
            cells[index] = true
        }

        function kill(index) {
            cells[index] = false
        }

        function toSerializable() {
            return cells
        }

        return {
            alive,
            birth,
            kill,
            toSerializable
        }
}

ArrayGrid.of = ArrayGrid

ArrayGrid.randomCells = function (size, density) {
    const result = new Array(size * size).fill(0).map(() => !!Math.round(Math.random()))
    return ArrayGrid(result)
}

ArrayGrid.toString = () => 'ArrayGrid'

export const gridTypes = {
    'SetGrid': SetGrid,
    'ArrayGrid': ArrayGrid
}