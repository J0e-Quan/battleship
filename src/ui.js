import './styles.css'
import { createPlayer } from './game.js'

const THREE_SECONDS = 3000
const human = createPlayer('human')
const computer = createPlayer('computer')
const humanGameboard = document.getElementById('human-gameboard')
const computerGameboard = document.getElementById('computer-gameboard')
const humanUI = document.querySelector('.human.gameboard-wrapper')
const computerUI = document.querySelector('.computer.gameboard-wrapper')
let isHumanTurn = false
renderGameboard('human')
renderGameboard('computer')
randomiseShipPlacements(human.gameboard)
randomiseShipPlacements(computer.gameboard)

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
  // clear gameboard of all ships before rendering new ones
  const allPoints = document.querySelectorAll('.human.point')
  allPoints.forEach((point) => {
    point.classList.remove('ship')
  })
  for (const ship of human.gameboard.ships) {
    for (const coord of ship.coordinates) {
      const point = document.getElementById('human-' + coord.x + '-' + coord.y)
      point.classList.add('ship')
    }
  }
}

function flipTurn() {
  isHumanTurn = !isHumanTurn
  if (isHumanTurn === true) {
    humanUI.classList.add('inactive')
    computerUI.classList.remove('inactive')
    computerGameboard.addEventListener('click', sendAttack, { once: true })
  } else {
    humanUI.classList.remove('inactive')
    computerUI.classList.add('inactive')
    computerAttack()
  }
}

function updateInstruction(text) {
  const instruction = document.querySelector('.instruction')
  instruction.textContent = text
}

computerGameboard.addEventListener('click', sendAttack, { once: true })

function sendAttack(button) {
  if (button.target.classList.contains('hit') || button.target.classList.contains('miss')) {
    alert('The same point cannot be attacked twice!')
    computerGameboard.addEventListener('click', sendAttack, { once: true })
    return
  }
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
      // no ship has been sunk, just show generic message
      updateInstruction('Hit!')
    } else {
      // a ship has been sunk, check if all ships of a player are sunk, otherwise show sunk ship message
      if (computer.gameboard.areAllShipsSunk()) {
        endGame('human')
        return
      } else if (human.gameboard.areAllShipsSunk()) {
        endGame('computer')
        return
      }
      updateInstruction('Hit! ' + shipStatus)
    }
  } else {
    point.classList.add('miss')
    updateInstruction('Miss!')
  }
  setTimeout(() => {
    flipTurn()
    if (isHumanTurn === false) {
      updateInstruction("It's the computer's turn!")
    } else {
      updateInstruction("It's the human's turn! Pick any point on the computer's gameboard to hit!")
    }
  }, THREE_SECONDS)
}

function checkSunk(attack, type) {
  if (type === 'computer') {
    const hitShip = computer.gameboard.ships.find((ship) => {
      return ship.coordinates.some((coord) => coord.x === attack.x && coord.y === attack.y)
    })
    if (hitShip !== undefined && hitShip.isSunk()) {
      return "You sunk the computer's " + hitShip.length + '-long ship!'
    }
  } else if (type === 'human') {
    const hitShip = human.gameboard.ships.find((ship) => {
      return ship.coordinates.some((coord) => coord.x === attack.x && coord.y === attack.y)
    })
    if (hitShip !== undefined && hitShip.isSunk()) {
      return 'The computer sunk your ' + hitShip.length + '-long ship!'
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
    }, THREE_SECONDS)
  }
}

function endGame(winner) {
  if (winner === 'human') {
    updateInstruction(
      'Human Wins! All computer ships have been sunk! Refresh the page to play again...'
    )
    const humanName = document.querySelector('.human-title')
    humanName.classList.add('winner')
    humanUI.classList.remove('inactive')
    computerUI.classList.add('disabled')
    alert('Human Wins! All computer ships have been sunk!')
  } else if (winner === 'computer') {
    updateInstruction('Computer Wins! All human ships have been sunk!')
    const computerName = document.querySelector('.computer-title')
    computerName.classList.add('winner')
    computerUI.classList.remove('inactive')
    computerUI.classList.add('inactive')
    renderComputerShips()
    alert('Computer Wins! All human ships have been sunk! Refresh the page to play again...')
  }
}

function renderComputerShips() {
  for (const ship of computer.gameboard.ships) {
    for (const coord of ship.coordinates) {
      const point = document.getElementById('computer-' + coord.x + '-' + coord.y)
      point.classList.add('hit')
    }
  }
}

const randomiseButton = document.querySelector('.randomise')
randomiseButton.addEventListener('click', (e) => {
  randomiseShipPlacements(human.gameboard)
})
const startButton = document.querySelector('.start')
startButton.addEventListener('click', (e) => {
  const uiButtons = document.querySelector('.ui-buttons')
  flipTurn()
  updateInstruction("It's the human's turn! Pick any point on the computer's gameboard to hit!")
  uiButtons.remove()
})

function randomiseShipPlacements(gameboard) {
  // clear ships array before inserting new ones
  gameboard.ships = []
  while (gameboard.ships.length < 5) {
    if (randomNumber(1, 2) === 1) {
      const result = gameboard.placeShip(
        gameboard.ships.length + 1,
        'horizontal',
        randomNumber(1, 10),
        randomNumber(1, 10)
      )
    } else if (randomNumber(1, 2) === 2) {
      const result = gameboard.placeShip(
        gameboard.ships.length + 1,
        'vertical',
        randomNumber(1, 10),
        randomNumber(1, 10)
      )
    }
  }
  renderHumanShips()
}
