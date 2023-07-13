$(function() {

    feather.replace(); // for icons
    $('.selectpicker').selectpicker(); // for flags select
    $('[data-toggle="tooltip"]').tooltip({ 'html': false }); // beware the right value is "false" otherwise risk of cross-site scripting (XSS)

});