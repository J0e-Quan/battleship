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