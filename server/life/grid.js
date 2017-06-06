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

export function SetGrid() {
    const cells = new Set()

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

SetGrid.randomCells = function (size, density) {
    const result = SetGrid()
    const fullEnough = () => result.size >= ((size * size) * density)
    until(fullEnough, () => result.birth(Math.floor((size * size) * Math.random())))
    return result
}