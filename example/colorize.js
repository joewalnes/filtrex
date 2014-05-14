function main() {
  buildTable($('.data tbody'), createRandomData(20));

  updateExpression();
  $('.expression').keyup(updateExpression)
    .focus();
}

/**
 * Create an array of {price:, weight:, taste:} objects
 * with random values.
 */
function createRandomData(count) {
  function rnd() {
    return Math.round(Math.random() * 1000) / 10;
  }
  var result = [];
  for (var i = 0; i < count; i++) {
    result.push({price:rnd(), weight:rnd(), taste:rnd()});
  }
  return result;
}

/**
 * Build table on page with items.
 */
function buildTable(tbody, data) {
  tbody.empty();
  data.forEach(function(item) {
    var row = $('<tr>').appendTo(tbody);
    $('<td>').appendTo(row).text(item.price);
    $('<td>').appendTo(row).text(item.weight);
    $('<td>').appendTo(row).text(item.taste);
    $('<td>').appendTo(row).addClass('expression-result');

    // Associate underlying data with row node so we can access it later
    // for filtering.
    row.data('item', item);
  });
}

/**
 * When user entered expression changes, attempt to parse it
 * and colorize rows based on expression.
 */
function updateExpression() {
  // Default colorizer will not color anything
  var nullColorizer = function(item) { return 0; }

  var input = $('.expression');
  var expression = input.val();

  var colorizer;

  if (!expression) {
    // No expression specified. Don't colorize anything.
    colorizer = nullColorizer;
    input.css('background-color', '#fff');
  } else {
    try {
      // Build highlighter from user's expression
      colorizer = compileExpression(expression); // <-- Filtrex!
      input.css('background-color', '#dfd');
    } catch (e) {
      // Failed to parse expression. Don't highlight anything.
      colorizer = nullColorizer;
      input.css('background-color', '#fdd');
    }
  }

  colorizeRows(colorizer);
}

// Thanks http://colorbrewer2.org/ !
var colorScale = ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8',
                  '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'];

/**
 * Given a higlighter function, call it on each row to
 * determine if it needs to be highlighted.
 */
function colorizeRows(colorizer) {
  $('.data > tbody > tr').each(function(i, rowEl) {
    var row = $(rowEl);
    var item = row.data('item');

    var result = colorizer(item); // <-- Compiled function from Filtrex!
    row.find('.expression-result').text(result);

    // Map that to index in colorScale array.
    var colorIndex = Math.round((result / 2 + 0.5) * colorScale.length);
    // Ensure we don't overflow the array.
    colorIndex = Math.min(colorIndex, colorScale.length - 1);
    colorIndex = Math.max(colorIndex, 0);
    // Set bg color
    row.css('background-color', colorScale[colorIndex]);
    // Make fg color readable
    row.css('color', (Math.abs(result) > 0.5 ) ? 'white' : 'black');
  });
}

$(main);
