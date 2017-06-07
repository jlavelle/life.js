import { game } from './life/life'

var path = require('path')
var express = require('express')


var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

const n = 100

let updateInterval = 100
let paused = false

function until (cond, action) {
    let status = cond()
    while(!status) {
        action()
        status = cond()
    }
}

function randomCells (filledFraction) {
    const result = new Set()
    const fullEnough = () => result.size >= ((n * n) * filledFraction)
    until(fullEnough, () => result.add(Math.floor((n * n) * Math.random())))
    return result
}

let cells = randomCells(0.5)

const gol = game(n)
setInterval(() => {
    if (!paused) {
        cells = gol(cells)
    }
}, updateInterval)

function update() {
    const updateData = renderDataToJSON()
    return updateData
}

function renderDataToJSON() {
    return JSON.stringify({ cells: [...cells] })
}

function togglePause() {
    paused = !paused
}

function applyInteraction(interactionEvent) {
    const event = JSON.parse(interactionEvent)
    if (event.erasing) {
        if (cells.has(event.index)) cells.delete(event.index)
    } else {
        cells.add(event.index)
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
        cells = randomCells(density)
    })
    socket.on('clear', () => cells.clear())
    socket.on('message', (message) => {
        io.emit('message', message)
    })
    socket.emit('start', n)
})

setInterval(() => {
    const updateData = update()
    io.emit('update', updateData)
}, updateInterval)

http.listen(3000, function () {
    console.log('Listening on port 3000.')
})
