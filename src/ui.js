import './styles.css'
import { createPlayer } from "./game.js"

const human = createPlayer('human')
const computer = createPlayer('computer')
renderGameboard('human')
renderGameboard('computer')

// temporary hardcoded ship placements
human.gameboard.placeShip(1, 'horizontal', 2, 3).placeShip(2, 'vertical', 4, 1).placeShip(3, 'vertical', 6, 3).placeShip(4, 'horizontal', 1, 8).placeShip(5, 'horizontal', 3, 6)
computer.gameboard.placeShip(1, 'horizontal', 8, 9).placeShip(2, 'vertical', 2, 1).placeShip(3, 'vertical', 7, 3).placeShip(4, 'horizontal', 3, 8).placeShip(5, 'horizontal', 1, 6)


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