// Global variable for keeping the list of active albums
var albumList = [];

// Build a gallery album item
function buildAlbum(item, index) {
  var html = "";
  html += '<div class="album" data-album-id="' + index + '">';
  html += '<img src="' + item.thumbnail + '" alt="' + item.name + '">';
  html += '</div>';

  return html;
}

// Update detail box
function updateDetails(id) {
  var info = albumList[id].details;
  var date = new Date(info.release_date);

  html  = info.artists[0].name + "<br>";
  html  += info.name + "<br>";
  html  += date.getFullYear() + "<br>";
  html  += info.tracks.total + " track(s)<br>";
  $(".info").html(html);
}


// Updates the page with the content of the albumList
function updateAlbums() {
  // Clear the gallery
  $("main.gallery").empty();
  if (albumList.length > 0) {
    // Iterate through each result and append to gallery
    $.each(albumList, function(index, item) {
      var albumHTML = buildAlbum(item, index);
      $("main.gallery").append(albumHTML);
    });
  }
  // Bind click events to all album elements
  $(".album").click(function(event){
    event.preventDefault();
      updateDetails($(this).attr("data-album-id"));
  });
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


// Fetches album details for the active list of albums
function fetchDetails() {
  $.each(albumList, function(index, item){
    var url = item.url;
    $.getJSON(url)
      .done(function(response){
        albumList[index].details = response;
      });
  });
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
            "id" : item.id,
            "name" : item.name,
            "thumbnail" : item.images[0].url,
            "url" : item.href
          };
          albumList.push(album);
        }
      });
      updateAlbums();
      enableForm();
      fetchDetails();
    })
    .fail(function(){
      albumList = [];
      updateAlbums();
      enableForm();
    });
}


$("document").ready(function(){

  // Form submit event handling
  $("#search-form").submit(function(event){
    // Prevents form from submitting
    event.preventDefault();
    // Captures the artist name, disables the form and runs the search
    var artist = $("#search-box").val();
    disableForm();
    searchAlbums(artist, 4);
  });

}); // .ready()
