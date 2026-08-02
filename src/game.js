export function createShip(length) {
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
    }
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
      createShip(length)
      const coords = []
      for (let i = 0; i < length; i++) {
        if (direction === 'horizontal') {
          coords.push({x: x + i, y})
        } else {
          coords.push({x, y: y + i})
        }
      }
      this.ships.push(coords)
      return this
    },
    receiveAttack(targetX, targetY) {
      for (const ship of ships) {
        for (const coord of ship) {
          if (coord.x === targetX && coord.y === targetY) {
            ship.hit()
            return ship.hits
          }
        }
      }
      this.misses.push({targetX, targetY})
      return 'miss at (' + targetX + ' , ' + targetY + ')'
    }
  }
}