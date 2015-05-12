(function(app) {
  'use strict';

  app.BookTreemap = function(container) {
    this.container = d3.select(container);
  };

  app.BookTreemap.prototype.render = function(notes) {
    var books = d3.nest().key(function(d) { return d.book; }).entries(notes),
        color = d3.scale.category20c(),
        size = this.container.node().getBoundingClientRect();

    var treemap = d3.layout.treemap()
      .size([size.width, size.height])
      .padding(3)
      .sticky(true)
      .value(function(d) { return d.values.length; });

    var tree = {
      name: 'root',
      children: books
    };

    var book = this.container.selectAll('.book')
      .data(treemap.nodes(tree))
      .enter().append('div')
      .on('click', openBook)
      .attr('class', 'book');

    book
      .style('position', 'absolute')
      .style('left', function(d) { return d.x + 'px'; })
      .style('top', function(d) { return d.y + 'px'; })
      .style('width', function(d) { return Math.max(0, d.dx - 1) + 'px'; })
      .style('height', function(d) { return Math.max(0, d.dy - 1) + 'px'; })
      .style('background', function(d) { return d.children ? null : color(d.key); });

    book
      .text(function(d) { return d.children ? null : d.key; })
      .append('span')
      .attr('class', 'notes-count')
      .style('background', function(d) { return d.children ? null : color(d.key); })
      .text(function(d) { return d.children ? null : d.values.length; });

    book
      .append('div')
      .attr('class', 'close')
      .on('click', closeBook);
  };

  function openBook() {
    var element = d3.select(this),
        notes = element.datum().values;

    element
      .classed('expanded', true)
      .append('ul')
      .attr('class', 'notes')

      .selectAll('.note')
      .data(notes)
      .enter().append('li')
      .attr('class', 'note')
      .text(function(d) { return d.text; });
  }

  function closeBook() {
    d3.select(this.parentNode).classed('expanded', false);
    d3.event.stopPropagation();
  }

})(window.kindleNotes = window.kindleNotes || {});
