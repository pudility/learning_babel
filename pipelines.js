module.exports = function(babel) {
  //define variables
  var t = babel.types;
  var traverse = [];

  //create format function that returns the name of either path.node.right or path.node.left or returns the path node if it cannot find the name
  function format(pns) {
    if (pns) {
      if (pns.name) {
        return pns.name;
      }
      return pns;
    }
    return null;
  }

  /*
  this function passes in a function to the existing function(s)
  or it passes in the inicial value if all of the functions have been
  passed in.
  */
  function createNesting(i){
    if (i < traverse.length-1) {
      return t.callExpression(
        t.identifier(traverse[i]),
        [createNesting(i+1)]
      )
    }
    return traverse[i]
  }

  return {
    visitor: {
      ArrowFunctionExpression: function(path){
        console.log(JSON.stringify(path.node, null, 4), '\n\n\n\n');
      },
      //looks for bianary expressions
      BinaryExpression: function(path){
        var pn = path.node;

        //makes sure that it is the correct operator.
        if (path.node.operator === '|') {
          //pushes the right value onto the array so that it can turn it into a function later
          traverse.push(format(pn.right))
          //if there is no more left values...
          if (!pn.left.left) {
            //it adds the left value to the array
            traverse.push(pn.left)

            //if the array is more than 2 elements long...
            if (traverse[2]) {
              //it creates one set of variables
              var other = t.callExpression(
                            //this defines the function
                            t.identifier(traverse[1]),
                            //and this uses the createNesting function to define what is passed into the function
                            [createNesting(2)]
                          )

              //this creates a new path that can be used to replace the other path
              var newPath = t.callExpression(
                              t.identifier(traverse[0]),
                              [other]
                            )
            //if it is not >= 3 elements in length...
            }else{
              //it creates a difforent variable to replace the path with
              var newPath = t.callExpression(
                              t.identifier(traverse[0]),
                              [traverse[1]]
                            )
            }

            //resets the array
            traverse = [];
            //replaces the parent path to avoid [this](https://github.com/babel/babylon/issues/728) issue, however causes a difforent issue where the arrow functions go away.
            var toReplace = path.findParent((path) => !path.parent().isBinaryExpression())
            //makes sure that toReplace is defined
            if (toReplace) {
              //replaces it
              toReplace.replaceWith(newPath);
            }
          }
        }
      }
    }
  };
};