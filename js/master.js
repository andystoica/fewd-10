// Global variable for keeping the list of active albums
var albumList = [];

// Build a gallery album item
function buildAlbum(item) {
  var html = "";
  html += '<div class="album">';
  html += ' <span class="artwork"><img src="' + item.thumbnail + '" alt=""></span>';
  html += '</div>';

  return html;
}

// Updates the page with the content of the albumList
function updateAlbums() {
  // Clear the gallery
  $("main.gallery").empty();
  console.log(albumList.length);
  if (albumList.length > 0) {
    // Iterate through each result and append to gallery
    $.each(albumList, function(index, item) {
      var albumHTML = buildAlbum(item);
      $("main.gallery").append(albumHTML);
    });
  }
}

// Temporarely disables the search form while the Ajax call is made
function disableForm() {
  $("#search-box").val("Searching ...");
  $("#search-btn").prop("disabled", true);
}

// Enables the form for a new search
function enableForm() {
  $("#search-box").val("");
  $("#search-btn").prop("disabled", false);
}


// Searches for an artist and replaces the albumList with the top limit albums
function searchAlbums(artist, limit) {
  var url = "https://api.spotify.com/v1/search";
  var data = {
    "type" : "album",
    "q" : artist,
    "limit" : limit
  };

  $.getJSON(url, data)
    .done(function(response){
      // Add all results to the main albumList
      albumList = [];

      $.each(response.albums.items, function(index, item){
        if (item.images.length > 0) {
          var album = {
            "name" : item.name,
            "thumbnail" : item.images[0].url
          };
          albumList.push(album);
        }
      });

      updateAlbums();
      enableForm();
    })
    .fail(function(){
      albumList = [];
      updateAlbums();
      enableForm();
    });
}


$("document").ready(function(){

  // Event binding
  $("#search-form").submit(function(event){
    // Prevents form from submitting
    event.preventDefault();
    // Captures the artist name, disables the form and runs the search
    var artist = $("#search-box").val();
    disableForm();
    searchAlbums(artist, 8);
  });

}); // .ready()
