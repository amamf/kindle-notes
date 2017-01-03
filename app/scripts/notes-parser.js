(function(app) {
  'use strict';

  app.NotesParser = {
    parse: function(source) {
      var notes = source.split('==========');

      notes = notes.map(function(note) {
        var parts = note.trim().split(/\n/).filter(function(p) {
          return p.trim() !== '';
        });

        if(parts.length === 0) {
          return;
        }

        return {
          book: parts[0],
          type: parts[1].match(/highlight/i) ? 'highlight' : 'bookmark',
          text: parts.length > 2 ? parts[2].trim() : ''
        };
      });

      notes = notes.filter(function(note) { return note; });

      return notes;
    }
  };

})(window.kindleNotes = window.kindleNotes || {});
