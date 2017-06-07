import { sum } from 'ramda'

import { game } from './life/life'
import { SetGrid, ArrayGrid } from '../shared/grid'

var path = require('path')
var express = require('express')

var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

const n = 100

let updateInterval = 10
let paused = false

let gridType = ArrayGrid

let cells = gridType.randomCells(n, 0.5)
let generations = 0

let ups = [] // updates per second, not accounting for the updateInterval
let lastAverage = 0

function getAverageUps() {
    let averageUps = ups.length == 0 ? lastAverage : Math.round(sum(ups) / ups.length)
    if(ups.length >= 30) {
        lastAverage = averageUps
        ups = []
    }
    return averageUps
}

let lastGeneration = Date.now()
let gps = 0 // generations per second, accounts for interval

const gol = game(gridType)(n)
setInterval(() => {
    let preUpdate = Date.now()
    if (!paused) {
        gps = Math.round(1000 / (Date.now() - lastGeneration))
        lastGeneration = Date.now()
        cells = gol(cells)
        generations += 1
        ups.push(1000 / (Date.now() - preUpdate))
    } else {
        gps = 0
    }
}, updateInterval)

function update() {
    return {
        cells: cells.toSerializable(),
        stats: {gps, ups: getAverageUps(), generations}
    }
}

function togglePause() {
    paused = !paused
}

function applyInteraction(event) {
    if (event.erasing) {
        if (cells.alive(event.index)) cells.kill(event.index)
    } else {
        cells.birth(event.index)
    }
}


app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../client/views/index.html'))
})

app.use('/static', express.static(path.resolve(__dirname, '../client/build')))

io.on('connection', function (socket) {
    console.log('a user connected')

    socket.on('message', (m) => console.log(m))
    socket.on('interaction', applyInteraction)
    socket.on('pause', togglePause)
    socket.on('randomFill', (density) => {
        cells = gridType.randomCells(n, density)
    })
    socket.on('clear', () => cells = gridType())
    socket.on('message', (message) => {
        io.emit('message', message)
    })
    setInterval(() => {
        const updateData = update()
        socket.emit('update', updateData)
    }, updateInterval)
    socket.emit('start', {
        size: n,
        gridType: gridType.toString()
    })
})

http.listen(3000, function () {
    console.log('Listening on port 3000.')
})
