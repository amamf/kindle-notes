(function(app) {
  'use strict';

app.BookCloud = function(container, type) {
  this.container = d3.select(container);
  this.type = type;
};

app.BookCloud.prototype.render = function(notes) {
  var that = this;

  var books = d3.nest().key(function(d) { return d.book; }).entries(notes),
      size = this.container.node().getBoundingClientRect(),
      color = d3.scale.category20(),
      fontSize = d3.scale.linear()
        .domain(d3.extent(books, function(n) { return n.values.length; } ))
        .range([14, 72]) ;

  switch(this.type) {
    case 'svg':
      d3.layout.cloud().size([size.width, size.height])
        .words(books.map(function(d) {
          return { text: d.key, size: d.values.length };
        }))
        .padding(5)
        .rotate(function() { return 0; })
        .font('Impact')
        .fontSize(function(d) { return fontSize(d.size); })
        .on('end', function (words) {
          that.container.append('svg')
            .attr('width', size.width)
            .attr('height', size.height)
            .append('g')
            .attr('transform', 'translate(' + size.width/2 + ',' + size.height/2 + ')')
            .selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', function(d) { return fontSize(d.size) + 'px'; })
            .style('font-family', 'Impact')
            .style('fill', function(d, i) { return color(i); })
            .attr('text-anchor', 'middle')
            .attr('transform', function(d) {
              return 'translate(' + [d.x, d.y] + ') rotate(' + d.rotate + ')';
            })
            .text(function(d) { return d.text; });
        })
        .start();

      break;
    case 'html':
      var book = this.container.selectAll('.book').data(books);

      book.enter()
        .append('div')
        .classed({ book: true })
        .style('font-size', function(d) { return fontSize(d.values.length) + 'px'; })
        .style('color', function(d, i) { return color(i); })
        .text(function(d) { return d.key; });

      break;
    default:
      throw new Error('Not supported cloud type.');
  }
};

})(window.kindleNotes = window.kindleNotes || {});
