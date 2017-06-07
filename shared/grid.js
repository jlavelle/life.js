/*
    Grid abstraction so that we can test the performance of
    different structures
*/

function createGridImpl(gridFunctions) {
    return function(size) {
        const gridFn = (newCells) => {
            let cells = gridFunctions.cells(size)(newCells)
            return {
                alive(index) {
                    return gridFunctions.alive.call(cells, index)
                },
                birth(index) {
                    gridFunctions.birth.call(cells, index)
                },
                kill(index) {
                    gridFunctions.kill.call(cells, index)
                },
                toSerializable() {
                    return gridFunctions.toSerializable(cells)
                },
                get living() {
                    return gridFunctions.living(cells)
                },
                get size() {
                    return size
                }
            }
        }
        gridFn.randomFill = gridFunctions.randomFill(size)
        gridFn.of = gridFunctions.of(size)
        gridFn.toString = gridFunctions.toString
        return gridFn
    }
}

export const SetGrid = createGridImpl({
    cells: (_) => (newCells) => newCells || new Set(),
    alive: Set.prototype.has,
    birth: Set.prototype.add,
    kill: Set.prototype.kill,
    living: (cells) => cells.size,
    toString: () => 'SetGrid',
    of: (size) => (idxArray) => SetGrid(size)(new Set([...idxArray])),
    toSerializable: Array.from,
    randomFill: (size) => (density) => {
        const result = SetGrid(size)()
        const fullEnough = () => result.living >= ((result.size * result.size) * density)
        until(fullEnough, () => result.birth(Math.floor((result.size * result.size) * Math.random())))
        return result
    }
})

export const ArrayGrid = createGridImpl({
    cells: (size) => (newCells) => newCells || new Array(size * size).fill(false),
    alive: function (index) { return this[index] },
    birth: function (index) { this[index] = true },
    kill: function (index) { this[index] = false },
    living: (cells) => cells.filter(cell => cell).length,
    toString: () => 'ArrayGrid',
    of: (size) => (array) => ArrayGrid(size)(array),
    toSerializable: (val) => val,
    randomFill: (size) => (density) => {
        const result = new Array(size * size).fill(0).map(() => Math.random() < density)
        return ArrayGrid(size)(result)
    }
})

export const UintArrayGrid = createGridImpl({
    cells: (size) => (newCells) => {
        if (newCells) return newCells
        const b = new ArrayBuffer(size * size)
        return new Uint8Array(b)
    },
    alive: function (index) { return this[index] },
    birth: function (index) { this[index] = 1 },
    kill: function (index) { this[index] = 0 },
    living: (cells) => cells.filter(cell => cell).length,
    toString: () => 'UintArrayGrid',
    of: (size) => (array) => UintArrayGrid(size)(array),
    toSerializable: (val) => val,
    randomFill: (size) => (density) => {
        const b = new ArrayBuffer(size * size)
        const result = new Uint8Array(size * size).fill(0).map(() => Math.random() < density ? 1 : 0)
        return UintArrayGrid(size)(result)
    }

})

function until (cond, action) {
    let status = cond()
    while(!status) {
        action()
        status = cond()
    }
}

export const gridTypes = {
    'SetGrid': SetGrid,
    'ArrayGrid': ArrayGrid,
    'UintArrayGrid': UintArrayGrid
}