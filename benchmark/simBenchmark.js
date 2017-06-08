import { range } from 'ramda'
import { game } from '../server/life/life'
import { ArrayGrid, SetGrid } from '../shared/grid'

function SimpleLifeBenchmark(gridConstructor, size, maxGens, trials) {
    const grid = gridConstructor(size)
    const sim = game(grid)(size)
    const randomGrids = range(0, trials).map((_) => grid.randomFill(0.5))
    const now = Date.now()
    randomGrids.forEach(grid => {
        for (let i = 0; i < maxGens; i++) {
            grid = sim(grid)
        }
    })
    return (Date.now() - now)
}

function runGridBenchmarks() {
    const generations = 1
    const size = 100
    const trials = 1000
    const types = [ArrayGrid]
    console.log(`Running Benchmarks with size=${size}, generations=${generations}, trials=${trials}`)
    types.forEach(type => {
        const time = SimpleLifeBenchmark(type, size, generations, trials)
        console.log(`${type(size).toString()}: ${time / trials}ms average per trial`)
    })
}

runGridBenchmarks()