module.exports = function(babel) {
  var t = babel.types;
  var traverse = [];

  function format(pns) {
    if (pns) {
      if (pns.name) {
        return pns.name;
      }
      return pns;
    }
    return null;
  }

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
      BinaryExpression: function(path){
        //console.log(JSON.stringify(path.node, null, 4));
        var pn = path.node;

        if (path.node.operator === '|') {
          traverse.push(format(pn.right))
          if (!pn.left.left) {
            traverse.push(pn.left)

            if (traverse[2]) {
              var other = t.callExpression(
                            t.identifier(traverse[1]),
                            [createNesting(2)]
                          )

              var newPath = t.callExpression(
                t.identifier(traverse[0]),
                [other]
              )
            }else{
              var newPath = t.callExpression(
                t.identifier(traverse[0]),
                [traverse[1]]
              )
            }

            console.log(path.scope.parent);

            traverse = [];

            var toRepace = path.findParent((path) => !path.isBinaryExpression())
            //toRepace = toRepace.skip()
            if (toRepace) {
              //console.log(toRepace);
              toRepace.replaceWith(newPath);
            }
          }
        }
      }
    }
  };
};