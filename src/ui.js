import './styles.css'
import { createPlayer } from "./game.js"

const THREE_SECONDS = 3000
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

function flipTurn() {
  isHumanTurn = !isHumanTurn
  const humanUI = document.querySelector('.human.gameboard-wrapper')
  const computerUI = document.querySelector('.computer.gameboard-wrapper')
  if (isHumanTurn === true) {
    humanUI.classList.add('inactive')
    computerUI.classList.remove('inactive')
    computerGameboard.addEventListener('click', sendAttack)
  } else {
    humanUI.classList.remove('inactive')
    computerUI.classList.add('inactive')
    computerGameboard.removeEventListener('click', sendAttack)
    computerAttack()
  }
}

function updateInstruction(text) {
  const instruction = document.querySelector('.instruction')
  instruction.textContent = text
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
  if (attack.type === 'hit') {
    point.classList.add('hit')
    const shipStatus = checkSunk(attack, type)
    if (shipStatus === undefined) {
      updateInstruction("Hit!")
    } else {
      updateInstruction("Hit! " + shipStatus)
    }
  } else {
    point.classList.add('miss')
    updateInstruction("Miss!")
  }
  setTimeout(() => {
    flipTurn()
    if (isHumanTurn === false) {
      updateInstruction("It's the computer's turn!")
    } else {
      updateInstruction("It's the human's turn! Pick any point on the computer's gameboard to hit!")
    }
  }, THREE_SECONDS);
}

function checkSunk(attack, type) {
  if (type === 'computer') {
    const hitShip = computer.gameboard.ships.find((ship) => {
      return ship.coordinates.some((coord) => coord.x === attack.x && coord.y === attack.y)
    })
    console.log(hitShip)
    if (hitShip !== undefined) {
      if (hitShip.isSunk()) {
        return 'You sunk a ' + hitShip.length + '-long ship!' 
      }
    }
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function computerAttack() {
  const attack = {
    x: randomNumber(1, 10),
    y: randomNumber(1, 10)
  }
  // checks if the point was already attacked
  const testPoint = document.getElementById('human-' + attack.x + '-' + attack.y)
  if (testPoint.classList.contains('hit') || testPoint.classList.contains('miss')) {
    computerAttack()
  } else {
    setTimeout(() => {
      renderAttack(human.gameboard.receiveAttack(attack.x, attack.y), 'human')
    }, THREE_SECONDS);
  }
}