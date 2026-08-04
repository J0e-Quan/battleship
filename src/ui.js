import './styles.css'
import { createPlayer } from "./game.js"

const human = createPlayer('human')
const computer = createPlayer('computer')
const humanGameboard = document.getElementById('human-gameboard')
const computerGameboard = document.getElementById('computer-gameboard')
let isHumanTurn = true
renderGameboard('human')
renderGameboard('computer')

// temporary hardcoded ship placements
human.gameboard.placeShip(1, 'horizontal', 2, 3).placeShip(2, 'vertical', 4, 1).placeShip(3, 'vertical', 6, 3).placeShip(4, 'horizontal', 3, 9).placeShip(5, 'horizontal', 5, 7)
computer.gameboard.placeShip(1, 'horizontal', 8, 9).placeShip(2, 'vertical', 2, 1).placeShip(3, 'vertical', 7, 3).placeShip(4, 'horizontal', 3, 8).placeShip(5, 'horizontal', 1, 6)
renderHumanShips()

function renderGameboard(type) {
  const targetId = type + '-gameboard'
  const gameboard = document.getElementById(targetId)
  for (let y = 1; y < 11; y++) {
    const row = document.createElement('div')
    row.classList.add('row')
    for (let x = 1; x < 11; x++) {
      const point = document.createElement('button')
      point.type = 'button'
      point.classList.add('point', type)
      point.id = type + '-' + x + '-' + y
      row.appendChild(point)
    }
    gameboard.appendChild(row)
  }
}

function renderHumanShips() {
  for (const ship of human.gameboard.ships) {
    for (const coord of ship.coordinates) {
      const point = document.getElementById('human-' + coord.x + '-' + coord.y)
      point.classList.add('ship')
    }
  }
}

computerGameboard.addEventListener('click', sendAttack)

function sendAttack(button) {
  const targetId = button.target.id
  // split the id up into its different components for easier use
  const targetIdArray = targetId.split('-')
  const targetDetails = {
    x: Number(targetIdArray[1]),
    y: Number(targetIdArray[2])
  }
  renderAttack(computer.gameboard.receiveAttack(targetDetails.x, targetDetails.y), 'computer')
}

function renderAttack(attack, type) {
  const point = document.getElementById(type + '-' + attack.x + '-' + attack.y)
  console.log(attack.type)
  if (attack.type === 'hit') {
    point.classList.add('hit')
  } else {
    point.classList.add('miss')
  }
}