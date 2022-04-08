const testID = document.getElementById("test");

$(document).ready(function () {
  $('.slider').slider({
    interval: 4500,
    indicators: false,
    height: 300
  });
  $('.sidenav').sidenav();
});
