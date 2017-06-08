import { game } from '../server/life/life'
import { ArrayGrid, SetGrid } from '../shared/grid'

function SimpleLifeBenchmark(gridConstructor, size, maxGens) {
    const grid = gridConstructor(size)
    let cells = grid.randomFill(0.5)
    const sim = game(grid)(size)

    const now = Date.now()
    for (let i = 0; i < maxGens; i++) {
        cells = sim(cells)
    }
    return (Date.now() - now)
}

const time = SimpleLifeBenchmark(ArrayGrid, 100, 1000)
console.log(`ArrayGrid n=100, generations=1000: ${time / 1000}s`)

const time2 = SimpleLifeBenchmark(SetGrid, 100, 1000)
console.log(`SetGrid n=100, generations=1000: ${time2 / 1000}s`)