export function createShip(length, direction, x, y) {
  function getShipCoordinates(direction, x, y) {
    const coordinates = []
    for (let i = 0; i < length; i++) {
      if (direction === 'horizontal') {
        coordinates.push({x: x + i, y})
      } else {
        coordinates.push({x, y: y + i})
      }
    }
    return coordinates
  }

  return {
    length,
    hits: 0,
    hit() {
      this.hits++
      return this
    },
    isSunk() {
      return this.hits >= this.length
    },
    coordinates: getShipCoordinates(direction, x, y)
  }
}

export function createGameboard() {
  return {
    ships: [],
    misses: [],
    hits: [],
    placeShip(length, direction, x, y) {
      const newShip = createShip(length, direction, x, y)
      // check if ship is placed/extends out of the gameboard
      if ((direction === 'horizontal' && x + length > 11 )||(direction === 'vertical' && y + length > 11)) {
        return null
      }
      // check if ship coords overlap
      for (const point of newShip.coordinates) {
        for (const existingShip of this.ships) {
          for (const coord of existingShip.coordinates) {
            if (coord.x === point.x && coord.y === point.y) {
              return null
            }
          }
        }
      }
      if (newShip !== null) {
        this.ships.push(newShip)
      }
      return this
    },
    receiveAttack(targetX, targetY) {
      for (const ship of this.ships) {
        for (const coord of ship.coordinates) {
          if (coord.x === targetX && coord.y === targetY) {
            ship.hit()
            this.hits.push({x: targetX, y: targetY})
            return this
          }
        }
      }
      this.misses.push({x: targetX, y: targetY})
      return this
    },
    areAllShipsSunk() {
      for (const ship of this.ships) {
        if (ship.isSunk() === false) {
          return this
        }
      }
      return true
    }
  }
}

export function createPlayer(type) {
  return {
    type,
    gameboard: createGameboard()
  }
}