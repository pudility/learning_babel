const double = x => x*2
const square = x => x*x
const half = x => x/2
const log = str => console.log(str)
const doubleAndSquare = x => x | double | square

for (var i = 0; i < 10; i++) {
  if (i/4 === 2 || i/2 === 2) {
    i | doubleAndSquare | log
  }else{
    i | doubleAndSquare | half | doubleAndSquare | half | log
  }
}