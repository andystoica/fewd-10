function transmissionCredits() {

  var url = "https://swapi.co/api/starships/";

  $.getJSON(url)
    .done(function(ships){
      // Select a random starshipt and update footer
      $(".galactic-credits").fadeOut();
      var lucky = ships.results[Math.floor(Math.random() * 10)];

      var message  = "This transmission was broadcasted from the ";
          message += lucky.name + ', ';
          message += 'model ' + lucky.model + ', ';
          message += 'hyperdrive rating ' + lucky.hyperdrive_rating + '.';

      $(".galactic-credits").text(message);
      $(".galactic-credits").fadeIn();
    })
    .fail(function(){
      // Update footer with dramatic message
      $(".galactic-credits").text("Oh boy, Darth Vader is comming ...");
    });

} // ---end--- transmissionCredits()
