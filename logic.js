module.exports = function(babel) {
  //define variables
  var t = babel.types;

  return {
    visitor: {
      ExpressionStatement: function(path){
        var pn = path.node;
        console.log(JSON.stringify(path.node, null, 4));
      }
    }
  };
};