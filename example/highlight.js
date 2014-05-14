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

    // Associate underlying data with row node so we can access it later
    // for filtering.
    row.data('item', item);
  });
}

/**
 * When user entered expression changes, attempt to parse it
 * and apply highlights to rows that match filter.
 */
function updateExpression() {
  // Default highlighter will not highlight anything
  var nullHighlighter = function(item) { return false; }

  var input = $('.expression');
  var expression = input.val();

  var highlighter;

  if (!expression) {
    // No expression specified. Don't highlight anything.
    highlighter = nullHighlighter;
    input.css('background-color', '#fff');
  } else {
    try {
      // Build highlighter from user's expression
      highlighter = compileExpression(expression); // <-- Filtrex!
      input.css('background-color', '#dfd');
    } catch (e) {
      // Failed to parse expression. Don't highlight anything.
      highlighter = nullHighlighter;
      input.css('background-color', '#fdd');
    }
  }

  highlightRows(highlighter);
}

/**
 * Given a higlighter function, call it on each row to
 * determine if it needs to be highlighted.
 */
function highlightRows(highlighter) {
  $('.data > tbody > tr').each(function(i, rowEl) {
    var row = $(rowEl);
    var item = row.data('item');
    var shouldHighlight = highlighter(item); // <-- Compiled function from Filtrex!
    row.css('background-color', shouldHighlight ? '#ff5' : '#fff');
  });
}

$(main);
