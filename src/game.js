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
    isSunk: false,
    hit() {
      this.hits++
      return this
    },
    checkSunk() {
      return this.isSunk = (this.hits >= this.length)
    },
    coordinates: getShipCoordinates(direction, x, y)
  }
}

export function createGameboard() {
  return {
    ships: [],
    misses: [],
    placeShip(length, direction, x, y) {
      const newShip = createShip(length, direction, x, y)
      // check if ship is placed/extends out of the gameboard
      if ((direction === 'horizontal' && x + length > 10 )||(direction === 'vertical' && y + length > 10)) {
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
            return this
          }
        }
      }
      this.misses.push({x: targetX, y: targetY})
      return this
    }
  }
}