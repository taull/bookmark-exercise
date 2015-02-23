//-----------
// MODEL
//-----------

  var Bookmark = Backbone.Model.extend({
    idAttribute: 'objectId',
    defaults: function(options) {
      var options = options || {};
      return _.defaults({
        'bookmark_title': 'Invalid Item',
        'bookmark_description': 'N/A',
        'bookmark_url': 'N/A',
        'bookmark_tag': 'N/A'
      });
    }
  });

  var Bookmarks = Backbone.Collection.extend({
    model: Bookmark,
    url: "https://api.parse.com/1/classes/bookmarks",
    parse: function(response) { return response.results;}
  });

  // 
  // var Tags = Backbone.Collection.extend({
  //   model: Tag,
  //   url: "https://api.parse.com/1/classes/bookmarks",
  //   parse: function(response) { return response.results;}
  // });

  //------------
  // VIEWS
  //------------

  var BookmarkNewView = Backbone.View.extend({
    el: '#bookmark-info',
    events: {
      'submit' : 'bookmarkInfo'
    },
    bookmarkInfo: function(e) {
      e.preventDefault();
      var bookmarkTitle = this.$('.bookmarkTitleInput').val();
      var bookmarkUrl = this.$('.bookmarkUrlInput').val();
      var bookmarkDescription = this.$('.bookmarkDescriptionInput').val();
      var bookmarkTag = this.$('.bookmarkTagInput').val();

      this.collection.create({bookmark_title: bookmarkTitle, bookmark_description: bookmarkDescription, bookmark_url: bookmarkUrl, bookmark_tag: bookmarkTag});
      this.$('.bookmarkTitleInput').val('');
      this.$('.bookmarkUrlInput').val('');
      this.$('.bookmarkDescriptionInput').val('');
      this.$('.bookmarkTagInput').val('');
    }
  });


  var BookmarkListView = Backbone.View.extend ({

    el: '.bookmark-listing',
    template: _.template($('[data-template-name="bookmark-list"]').text()),

    events: {

        },

    render: function() {
      var that = this;
      this.collection.each(function(bookmark) {
        that.$el.append( that.template( bookmark.toJSON() ) );
    });
      return this;
    }
  });

  // var TagListView = Backbone.View.extend ({
  //
  //   el: '.tag-listing',
  //   template: _.template($('[data-template-name="tag-list"]').text()),
  //
  //   events: {
  //
  //   },
  //
  //   render: function() {
  //     var that = this;
  //     this.collection.each(function(tag) {
  //       that.$el.append( that.template( tag.toJSON() ) );
  //     });
  //     return this;
  //   }
  // });



    //--------------
    // ROUTER
    //--------------

     var AppRouter = Backbone.Router.extend ({
        routes: {
          '': 'index',
          'showBookmark/:id': 'showBookmark'
          },
            initialize: function() {
              this.bookmarks = new Bookmarks();
              this.bookmarksList = new BookmarkListView({collection: this.bookmarks});
              // this.tags = new Tags();
              // this.tagsList = new TagListView({collection: this.tags});
              },

            index: function(){
              var that = this;
              this.bookmarks.fetch().done(function() {
                that.bookmarksList.render();
                });
              // this.tags.fetch().done(function() {
              //   that.tagsList.render();
              // });
              },

            // showBookmark: function(id){
            //
            //   var that = this;
            //
            //   this.bookmarks.fetch().done(function() {
            //     foundModel = that.bookmarks.get(id);
            //     var bookmarkFull = new BookmarkFullView({model: foundModel});
            //     bookmarkFull.render();
            //     $('.full-bookmark').html(bookmarkFull.el);
            // });

        });

  //----------------
  // Configuration
  //----------------


  $.ajaxSetup({
    headers: {
      "X-Parse-Application-Id": "p4LcteLYlQmXIHi2ptMCOj4Zqtx9TcNHNB6EWi1l",
      "X-Parse-REST-API-Key": "bGWZQP5qEfxdepnoxfH6g0sIeqDChMLGn8Y5avXH"
    }
  });

  var bookmarks = new Bookmarks();
  var bookmarkNew = new BookmarkNewView({collection: bookmarks});

  $(document).ready(function() {
    window.appRouter = new AppRouter();
    Backbone.history.start();
});
