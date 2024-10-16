
var userID = "test user";

$(function() {
    $(".pageContainer").hide();
    var sessionID = getUrlParameter('sessionID');
    createUserSession(sessionID, getUserSites);
});

function getUserSites(result) {
    $('#sitesContainer').html("");
    var data = {
         sessionID: sessionID,
         userID: userID
     }
     var url = webApiBaseUrl + 'api/values/GetUserSites';
     $.ajax({
         url: url,
         type: "post",
         headers: { 
            Authorization: 'Bearer ' + accessToken, 
        }, 
         contentType: "application/json;charset=utf-8",
         data: JSON.stringify(data),
         dataType: 'json',
         success: function (result) {
             var userSites = result.userSites;
             for (var i = 0; userSites.length; i++) {
                var div = $('<div style="cursor: pointer">');
                div.attr('data-siteUrl', userSites[i].siteUrl);
                div.attr('onclick','openSite(this); return false;');
                div.text(userSites[i].siteName);
                $('#sitesContainer').append(div);
             }
         },
         error: function (xhr, status, error) {
             if (xhr.status == 401) {
                navigateToAuthenticationPage();
             }
             else {
                alert(xhr.status); // HTTP status code
                //                    alert(xhr.responseText); // Response body
                alert(error); // Error message
            }
        }
    });
}

function navigateToAuthenticationPage() {
    window.location.href = "./index.html";
}

function openSite(elem) {
    var siteUrl = $(elem).attr('data-siteUrl');
    window.open(siteUrl, '_blank');
}
 

