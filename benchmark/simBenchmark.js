import { range, sum } from 'ramda'
import { game } from '../server/life/life'
import { ArrayGrid, SetGrid } from '../shared/grid'

function SimpleLifeBenchmark(gridConstructor, size, maxGens, trials) {
    const grid = gridConstructor(size)
    const sim = game(grid)(size)
    const randomGrids = range(0, trials).map((_) => grid.randomFill(0.5))
    const results = []
    randomGrids.forEach(grid => {
        const now = Date.now()
        for (let i = 0; i < maxGens; i++) {
            grid = sim(grid)
        }
        results.push(Date.now() - now)
    })
    return sum(results) / results.length
}

function runGridBenchmarks() {
    const generations = 1
    const size = 1000
    const trials = 10
    const types = [ArrayGrid]
    console.log(`Running Benchmarks with size=${size}, generations=${generations}, trials=${trials}`)
    types.forEach(type => {
        const time = SimpleLifeBenchmark(type, size, generations, trials)
        console.log(`${type(size).toString()}: ${time}ms average per trial`)
    })
}

runGridBenchmarks()