var { ipcRenderer } = require('electron');

$(document).on('keydown', function( event ) {
  if ( event.which == 192 ) {
     $("#menu").toggleClass("slid");
  }

  if ( event.which == 84 ) {
    $(".main-card").addClass("hidden");
    $(".loading-card").removeClass("hidden");
    $(".success-card").addClass("hidden");
    setTimeout(function () {
      $(".main-card").addClass("hidden");
          $(".loading-card").addClass("hidden");
          $(".success-card").removeClass("hidden");
      setTimeout(function () {
        $(".main-card").removeClass("hidden");
        $(".loading-card").addClass("hidden");
        $(".success-card").addClass("hidden");
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

$("#candidateid").on('change input', function(){
  ipcRenderer.send('updateCandidateId', $(this).val());
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
  console.log(data);
  var newData = JSON.parse(data.body);
  $(".main-card").addClass("hidden");
  $(".loading-card").addClass("hidden");
  $("#team").text("-"+newData["team"]);
  $(".success-card").removeClass("hidden");
  setTimeout(function () {
   $(".main-card").removeClass("hidden");
     $(".loading-card").addClass("hidden");
     $(".success-card").addClass("hidden");
  }, 4000);
});

ipcRenderer.on('badge-error', function(event, data){
  console.log("recieved badge-error: "+data);
  $(".main-card").removeClass("hidden");
  $(".loading-card").addClass("hidden");
  $(".success-card").addClass("hidden");
  console.log(data);
});

var capitalize =  function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}