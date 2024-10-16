$(function() {
    $(".pageContainer").hide();
    var sessionID = getUrlParameter('sessionID');
    createUserSession(sessionID, null);
});
