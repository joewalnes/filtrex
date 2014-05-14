function main() {
  $('.expression').keyup(updateExpression)
    .focus();
  updateExpression();
}

// Allow more mathematical functions to be called from expressions.
var additionalFunctions = {
  acos: Math.acos,
  asin: Math.asin,
  atan: Math.atan,
  atan2: Math.atan2,
  cos: Math.cos,
  exp: Math.exp,
  sin: Math.sin,
  tan: Math.tan,
};

/**
 * When user entered expression changes, attempt to parse it
 * and colorize rows based on expression.
 */
function updateExpression() {
  var input = $('.expression');
  var expression = input.val();
  $('.plot').hide();

  if (!expression) {
    // No expression specified. Don't plot.
    input.css('background-color', '#fff');
    return;
  }

  try {
    var plotFunction = compileExpression(expression, additionalFunctions); // <-- Filtrex!
    input.css('background-color', '#dfd');
  } catch (e) {
    // Failed to parse expression. Don't plot.
    input.css('background-color', '#fdd');
    return;
  }

  render(plotFunction);
}

/**
 * Render plotFunction. Uses http://www.flotcharts.org/
 */
function render(plotFunction) {
  var data = [];
  for (var x = -10; x <= 10; x+= 0.1) {
    var y = plotFunction({x:x}); // <-- Execute Filtrex expression from user
    data.push([x, y]);
  }
  $.plot($('.plot'), [data], {});
  $('.plot').show();
}

$(main);
