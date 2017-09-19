const double = x => x*2
const square = x => x*x
const half = x => x/2
const root = x => x | Math.sqrt

const doubleAndSquare = x => x | double | square 
const halfAndRoot = x => x | half | root

for (var i = 0; i < 10; i++) {
  if (i/5 === 2 || i/2 === 2) {
    console.log(doubleAndSquare(2))
  }
}