import { createGameboard, createShip } from "./game.js";

test('create ship that is 3 spots long', () => {
  expect(createShip(3).length).toBe(3)
})

test('increase hits after using hit()', () => {
  expect(createShip(2).hit().hits).toBe(1)
})

test('mark ship as sunk if hits >= length', () => {
  expect(createShip(2).hit().hit().checkSunk()).toBe(true)
})

test('prevent placing ships out of the gameboard', () => {
  expect(createGameboard().placeShip(2, 'horizontal', 11, 12)).toBe(null)
})

test('prevent placing ships that extend out of the gameboard (but originate within the gameboard', () => {
  expect(createGameboard().placeShip(4, 'vertical', 6, 8)).toBe(null)
})

test('create ship correctly in gameboard', () => {
  expect(createGameboard().placeShip(2, 'horizontal', 2, 5).ships).toStrictEqual([[{"x": 2, "y": 5}, {"x": 3, "y": 5}]])
})