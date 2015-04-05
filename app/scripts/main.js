(function(app) {
  'use strict';

  var NotesParser = app.NotesParser,
      BookTreemap = app.BookTreemap;

  d3.select(document).on('DOMContentLoaded', function(){
    var bookTreemap = new BookTreemap('.book-treemap');

    d3.select('.file').on('change', function() {
      var file = d3.event.target.files[0];

      var reader = new FileReader();
      reader.onload = function(e) {
        var notes = NotesParser.parse(e.target.result).filter(function(note) {
          return note.type === 'highlight';
        });

        d3.select('.select-clippings').classed('top', true);

        setTimeout(function() {
          bookTreemap.render(notes);
        }, 200);
      };
      reader.readAsText(file);
    });

  });

})(window.kindleNotes = window.kindleNotes || {});
