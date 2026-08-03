import './styles.css'
import { createPlayer } from "./game.js"

const human = createPlayer('human')
const computer = createPlayer('computer')
renderGameboard('human')
renderGameboard('computer')

function renderGameboard(type) {
  const targetId = type + '-gameboard'
  const gameboard = document.getElementById(targetId)
  console.log(gameboard)
  for (let i = 1; i < 11; i++) {
    const row = document.createElement('div')
    row.classList.add('row')
    row.id = 'y-' + i
    for (let i = 1; i < 11; i++) {
      const point = document.createElement('button')
      point.type = 'button'
      point.classList.add('point')
      point.id = 'x-' + i
      row.appendChild(point)
    }
    gameboard.appendChild(row)
  }
}