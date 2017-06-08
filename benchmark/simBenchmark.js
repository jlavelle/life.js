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

function runGridBenchmarks() {
    const generations = 100
    const size = 100
    const types = [ArrayGrid, SetGrid]
    console.log(`Running Benchmarks with size=${size}, generations=${generations}`)
    types.forEach(type => {
        const time = SimpleLifeBenchmark(type, size, generations)
        console.log(`${type(size).toString()}: ${time / 1000}s`)
    })
}

runGridBenchmarks()