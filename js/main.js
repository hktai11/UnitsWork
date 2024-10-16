
var sessionID = "";
var accessToken = "";

//var webApiBaseUrl = 'http://localhost:55307/';
var webApiBaseUrl = 'https://drmphkwsrv13.gdev.ad.umshk.local:8094/';

function createUserSession(sessionID, callback) {
    var data = {
        sessionID: sessionID
     }
     var url = webApiBaseUrl + 'api/values/CreateUserSession';
     $.ajax({
         url: url,
         type: "post",
         contentType: "application/json;charset=utf-8",
         data: JSON.stringify(data),
         dataType: 'json',
         success: function (result) {
            if (result.token != '') {
                accessToken = result.token;
                $(".pageContainer").show();
                if (callback != null) {
                    callback(result);
                }
            }
            else {
                window.location.href = './index.html';
            }
         },
         error: function (xhr, status, error) {
            window.location.href = './index.html';
         }
     });
 }

 function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? '' : decodeURIComponent(sParameterName[1]);
        }
    }
    return '';
};

function backToMain() {
    window.location.href = "index.html";
}