$(document).ready(function() {
    console.log("ready!");
    $('#favorite').toggle(function() {
        $("#favorite").addClass("active");
    }, function() {
        $("#favorite").removeClass("active");
    });
});
