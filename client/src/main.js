import io from 'socket.io-client'

import { Actions } from './actions'
import { LifeUI } from './lifeUI'
import { ChatUI } from './chatUI'
import { gridTypes } from '../../shared/grid'

const socket = io()

function run({size, gridType}) {
  console.log(gridTypes[gridType])
  const gridFn = gridTypes[gridType](size)
  Actions.initialize(socket, () => {
    const lifeUI = LifeUI(size, gridFn)
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