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
      if (x + length > 10 || y + length > 10) {
        return null
      }
      this.ships.push(createShip(length, direction, x, y))
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