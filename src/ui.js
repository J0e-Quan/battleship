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
let mode = 'computer'
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
    point.classList.remove('ship', 'p1-ship')
  })
  for (const ship of human.gameboard.ships) {
    for (const coord of ship.coordinates) {
      const point = document.getElementById('human-' + coord.x + '-' + coord.y)
      if (mode === 'computer') {
        point.classList.add('ship')
      } else {
        point.classList.add('p1-ship')
      }
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
    if (mode === 'computer') {
      computerAttack()
    } else if (mode === 'human') {
      humanGameboard.addEventListener('click', sendAttack, { once: true })
    }
  }
}

function updateInstruction(text) {
  const instruction = document.querySelector('.instruction')
  instruction.textContent = text
}

function sendAttack(button) {
  if (
    button.target.classList.contains('hit') ||
    button.target.classList.contains('miss') ||
    button.target.classList.contains('p1-ship-hit') ||
    button.target.classList.contains('p2-ship-hit')
  ) {
    alert('The same point cannot be attacked twice!')
    if (mode === 'computer' || (mode === 'human' && isHumanTurn === true)) {
      computerGameboard.addEventListener('click', sendAttack, { once: true })
    } else if (mode === 'human' && isHumanTurn === false) {
      humanGameboard.addEventListener('click', sendAttack, { once: true })
    }
    return
  }
  const targetId = button.target.id
  // split the id up into its different components for easier use
  const targetIdArray = targetId.split('-')
  const targetDetails = {
    x: Number(targetIdArray[1]),
    y: Number(targetIdArray[2])
  }
  if (mode === 'computer' || (mode === 'human' && isHumanTurn === true)) {
    renderAttack(computer.gameboard.receiveAttack(targetDetails.x, targetDetails.y), 'computer')
  } else if (mode === 'human' && isHumanTurn === false) {
    renderAttack(human.gameboard.receiveAttack(targetDetails.x, targetDetails.y), 'human')
  }
}

function renderAttack(attack, type) {
  const point = document.getElementById(type + '-' + attack.x + '-' + attack.y)
  if (attack.type === 'hit') {
    if (mode === 'computer') {
      point.classList.add('hit')
    } else if (mode === 'human' && type === 'human') {
      point.classList.add('p1-ship-hit')
    } else if (mode === 'human' && type === 'computer') {
      point.classList.add('p2-ship-hit')
    }
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
      if (mode === 'computer') {
        updateInstruction("It's the computer's turn!")
      } else if (mode === 'human') {
        blockPeeking(2)
        swapShips(2)
        updateInstruction("It's Player 2's turn! Pick any point on Player 1's gameboard to hit!")
      }
    } else {
      if (mode === 'computer') {
        updateInstruction(
          "It's the human's turn! Pick any point on the computer's gameboard to hit!"
        )
      } else if (mode === 'human') {
        blockPeeking(1)
        swapShips(1)
        updateInstruction("It's Player 1's turn! Pick any point on Player 2's gameboard to hit!")
      }
    }
  }, THREE_SECONDS)
}

function checkSunk(attack, type) {
  const shipNames = {
    1: 'Patrol Boat',
    2: 'Submarine',
    3: 'Cruiser',
    4: 'Battleship',
    5: 'Aircraft Carrier'
  }
  if (type === 'computer') {
    const hitShip = computer.gameboard.ships.find((ship) => {
      return ship.coordinates.some((coord) => coord.x === attack.x && coord.y === attack.y)
    })
    if (hitShip !== undefined && hitShip.isSunk()) {
      if (mode === 'computer') {
        return "You sunk the computer's " + shipNames[hitShip.length] + '!'
      } else if (mode === 'human') {
        return "You sunk Player 2's " + shipNames[hitShip.length] + '!'
      }
    }
  } else if (type === 'human') {
    const hitShip = human.gameboard.ships.find((ship) => {
      return ship.coordinates.some((coord) => coord.x === attack.x && coord.y === attack.y)
    })
    if (hitShip !== undefined && hitShip.isSunk()) {
      if (mode === 'computer') {
        return 'The computer sunk your ' + shipNames[hitShip.length] + '!'
      } else if (mode === 'human') {
        return "You sunk Player 1's " + shipNames[hitShip.length] + '!'
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
    }, THREE_SECONDS)
  }
}

function endGame(winner) {
  if (winner === 'human') {
    const humanName = document.querySelector('.human-title')
    humanName.classList.add('winner')
    humanUI.classList.remove('inactive')
    computerUI.classList.remove('inactive')
    computerUI.classList.add('no-hover')
    if (mode === 'computer') {
      updateInstruction(
        'Human Wins! All computer ships have been sunk! Refresh the page to play again...'
      )
      alert('Human Wins! All computer ships have been sunk! Refresh the page to play again...')
    } else if (mode === 'human') {
      updateInstruction(
        'Player 1 Wins! All Player 2 ships have been sunk! Refresh the page to play again...'
      )
      alert('Player 1 Wins! All Player 2 ships have been sunk! Refresh the page to play again...')
      revealP1Ships()
    }
  } else if (winner === 'computer') {
    const computerName = document.querySelector('.computer-title')
    computerName.classList.add('winner')
    humanUI.classList.remove('inactive')
    computerUI.classList.remove('inactive')
    computerUI.classList.add('no-hover')
    if (mode === 'computer') {
      updateInstruction(
        'Computer Wins! All human ships have been sunk! Refresh the page to play again...'
      )
      alert('Computer Wins! All human ships have been sunk! Refresh the page to play again...')
      revealComputerShips()
    } else if (mode === 'human') {
      updateInstruction(
        'Player 2 Wins! All Player 1 ships have been sunk! Refresh the page to play again...'
      )
      alert('Player 2 Wins! All Player 1 ships have been sunk! Refresh the page to play again...')
      revealP2Ships()
    }
  }
}

function revealComputerShips() {
  for (const ship of computer.gameboard.ships) {
    for (const coord of ship.coordinates) {
      const point = document.getElementById('computer-' + coord.x + '-' + coord.y)
      point.classList.add('hit')
    }
  }
}

function revealP1Ships() {
  for (const ship of human.gameboard.ships) {
    for (const coord of ship.coordinates) {
      const point = document.getElementById('human-' + coord.x + '-' + coord.y)
      if (!point.classList.contains('p1-ship-hit')) {
        point.classList.add('p1-ship')
      } else {
        point.classList.add('p1-ship-hit')
      }
    }
  }
}

function revealP2Ships() {
  for (const ship of computer.gameboard.ships) {
    for (const coord of ship.coordinates) {
      const point = document.getElementById('computer-' + coord.x + '-' + coord.y)
      if (!point.classList.contains('p2-ship-hit')) {
        point.classList.add('p2-ship')
      } else {
        point.classList.add('p2-ship-hit')
      }
    }
  }
}

function renderP2Ships() {
  // clear gameboard of all ships before rendering new ones
  const allPoints = document.querySelectorAll('.computer.point')
  allPoints.forEach((point) => {
    point.classList.remove('p2-ship')
  })
  for (const ship of computer.gameboard.ships) {
    for (const coord of ship.coordinates) {
      const point = document.getElementById('computer-' + coord.x + '-' + coord.y)
      point.classList.add('p2-ship')
    }
  }
}

const randomiseButton = document.querySelector('.randomise')
randomiseButton.addEventListener('click', (e) => {
  if (
    mode === 'computer' ||
    (mode === 'human' && document.querySelector('.instruction').textContent.includes('1'))
  ) {
    randomiseShipPlacements(human.gameboard)
  } else if (mode === 'human' && document.querySelector('.instruction').textContent.includes('2')) {
    randomiseShipPlacements(computer.gameboard)
  }
})
const startButton = document.querySelector('.start')
startButton.addEventListener('click', startGame)
const modeToggle = document.querySelector('.mode')
modeToggle.addEventListener('change', changeMode)

function randomiseShipPlacements(gameboard) {
  // clear ships array before inserting new ones
  gameboard.ships = []
  while (gameboard.ships.length < 5) {
    if (randomNumber(1, 2) === 1) {
      gameboard.placeShip(
        gameboard.ships.length + 1,
        'horizontal',
        randomNumber(1, 10),
        randomNumber(1, 10)
      )
    } else if (randomNumber(1, 2) === 2) {
      gameboard.placeShip(
        gameboard.ships.length + 1,
        'vertical',
        randomNumber(1, 10),
        randomNumber(1, 10)
      )
    }
  }
  if (
    mode === 'computer' ||
    (mode === 'human' && document.querySelector('.instruction').textContent.includes('1'))
  ) {
    renderHumanShips()
  } else if (mode === 'human' && document.querySelector('.instruction').textContent.includes('2')) {
    renderP2Ships()
  }
}

function startGame() {
  if (mode === 'computer') {
    const uiButtons = document.querySelector('.ui-buttons')
    flipTurn()
    updateInstruction("It's the human's turn! Pick any point on the computer's gameboard to hit!")
    uiButtons.remove()
  } else if (
    mode === 'human' &&
    document.querySelector('.instruction').textContent ===
      'Player 1, choose the position of your ships!'
  ) {
    updateInstruction('Player 2, choose the position of your ships!')
    startButton.textContent = 'Start Game'
    humanUI.classList.add('inactive')
    computerUI.classList.remove('inactive')
    swapShips(2)
    blockPeeking(2)
  } else if (
    mode === 'human' &&
    document.querySelector('.instruction').textContent ===
      'Player 2, choose the position of your ships!'
  ) {
    const uiButtons = document.querySelector('.ui-buttons')
    swapShips(1)
    blockPeeking(1)
    flipTurn()
    updateInstruction("It's Player 1's turn! Pick any point on Player 2's gameboard to hit!")
    uiButtons.remove()
  }
}

function changeMode(toggle) {
  mode = toggle.target.value
  if (mode === 'computer') {
    // since the default mode is 'computer', refreshing the page is easier than rebuilding and resetting the ui
    location.reload()
  } else if (mode === 'human') {
    const p1Title = document.querySelector('.human-title')
    p1Title.textContent = 'Player 1'
    const p2Title = document.querySelector('.computer-title')
    p2Title.textContent = 'Player 2'
    startButton.textContent = 'Continue'
    updateInstruction('Player 1, choose the position of your ships!')
  }
}

function blockPeeking(nextPlayer) {
  const modal = document.createElement('div')
  modal.classList.add('modal')
  const title = document.createElement('h3')
  title.textContent = 'No Peeking!'
  modal.appendChild(title)
  const text = document.createElement('p')
  text.classList.add('modal-text')
  text.textContent =
    "It's time to switch players! Please pass the device to Player " + nextPlayer + '!'
  modal.appendChild(text)
  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('close', 'ui-button')
  closeButton.textContent = 'Done!'
  closeButton.addEventListener('click', (e) => {
    modal.remove()
  })
  modal.appendChild(closeButton)
  document.body.appendChild(modal)
}

function swapShips(currentPlayer) {
  if (currentPlayer === 1) {
    humanUI.classList.add('no-hover')
    computerUI.classList.remove('no-hover')
    const enemyPoints = document.querySelectorAll('.p2-ship')
    enemyPoints.forEach((point) => {
      point.classList.remove('p2-ship')
    })
    renderHumanShips()
  } else if (currentPlayer === 2) {
    humanUI.classList.remove('no-hover')
    computerUI.classList.add('no-hover')
    const enemyPoints = document.querySelectorAll('.ship, .p1-ship')
    enemyPoints.forEach((point) => {
      point.classList.remove('p1-ship', 'ship')
    })
    renderP2Ships()
  }
}
