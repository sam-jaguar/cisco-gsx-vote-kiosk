var { ipcRenderer } = require('electron');

$(".flipper").click(function(){
  $(this).toggleClass("flipped");
});

$(document).on('keydown', function( event ) {
  if ( event.which == 192 ) {
     $("#menu").toggleClass("slid");
  }
});

$("#requestUrl").on('change input', function(){
  ipcRenderer.send('updateUrl', $(this).val());
});
