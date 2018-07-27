var { ipcRenderer } = require('electron');

$(document).on('keydown', function( event ) {
  if ( event.which == 192 ) {
     $("#menu").toggleClass("slid");
  }

  if ( event.which == 84 ) {
     $(".card").toggleClass("hidden");
     setTimeout(function () {
      $(".success-card").toggleClass("hidden");
      $(".card").toggleClass("hidden");
      setTimeout(function () {
       $(".success-card").toggleClass("hidden");
      }, 4000);
     }, 2000);
  }
});

$("#requestUrl").on('change input', function(){
  ipcRenderer.send('updateUrl', $(this).val());
});

$("#requestPort").on('change input', function(){
  ipcRenderer.send('updatePort', $(this).val());
});

ipcRenderer.on('badge-loading', function(event, data){
  console.log("recieved badge-loading: "+data);
  $(".main-card").addClass("hidden");
  $(".loading-card").removeClass("hidden");
  $(".success-card").addClass("hidden");
  var firstName = capitalize(data.firstName.toLowerCase());
  var lastName = capitalize(data.lastName.toLowerCase());
  $("#name").text(firstName+" "+lastName)
});

ipcRenderer.on('badge-success', function(event, data){
  console.log("recieved badge-success: "+data);
  $(".main-card").addClass("hidden");
  $(".loading-card").addClass("hidden");
  $(".success-card").removeClass("hidden");
  console.log(data);
  setTimeout(function () {
   $(".main-card").removeClass("hidden");
     $(".loading-card").addClass("hidden");
     $(".success-card").addClass("hidden");
  }, 4000);
});

var capitalize =  function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}