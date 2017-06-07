import io from 'socket.io-client'

import { Actions } from './actions'
import { LifeUI } from './lifeUI'
import { ChatUI } from './chatUI'

const socket = io()

function run({size, gridType}) {
  Actions.initialize(socket, () => {
    const lifeUI = LifeUI(size)
    const chatUI = ChatUI()

    socket.on('update', event => {
      lifeUI.updateCells(event.cells)
      lifeUI.updateStats(event.stats)
    })

    socket.on('message', chatUI.addMessage)

    lifeUI.renderLoop()
  })
}

socket.on('start', run)