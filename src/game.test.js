import { createShip } from "./game.js";

test('create ship that is 3 spots long', () => {
  expect(createShip(3).length).toBe(3)
})

test('increase hits after using hit()', () => {
  expect(createShip(2).hit().hits).toBe(1)
})

test('mark ship as sunk if hits >= length', () => {
  expect(createShip(2).hit().hit().checkSunk()).toBe(true)
})