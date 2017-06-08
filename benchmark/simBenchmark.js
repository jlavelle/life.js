import { game } from '../server/life/life'
import { ArrayGrid, SetGrid } from '../shared/grid'

function SimpleLifeBenchmark(gridConstructor, size, maxGens, trials) {
    const grid = gridConstructor(size)
    let cells = grid.randomFill(0.5)
    const sim = game(grid)(size)

    const now = Date.now()
    for (let i = 0; i < trials; i++) {
        for (let j = 0; j < maxGens; j++) {
            cells = sim(cells)
        }
    }
    return (Date.now() - now)
}

function runGridBenchmarks() {
    const generations = 1
    const size = 1000
    const trials = 1
    const types = [ArrayGrid, SetGrid]
    console.log(`Running Benchmarks with size=${size}, generations=${generations}, trials=${trials}`)
    types.forEach(type => {
        const time = SimpleLifeBenchmark(type, size, generations, trials)
        console.log(`${type(size).toString()}: ${time / 1000}s`)
    })
}

runGridBenchmarks()