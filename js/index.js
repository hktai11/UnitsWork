
//var webApiBaseUrl = 'http://localhost:55307/';
var webApiBaseUrl = 'https://drmphkwsrv13.gdev.ad.umshk.local:8094/';

$(function() {

    for (var i = 1; i <= 100; i++) {
        var newDiv = $('<div>', {
            text: i.toString() + ' message'
        });
        $('#container').append(newDiv);
    }
});

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

function login() {

    /*
    var config = {
        authority: 'https://dums01.bochk.com:443/adfs/',
        client_id: 'S0518DMP',
        redirect_uri: 'https://drmphkwsrv13.gdev.ad.umshk.local:8095/portal.html',
        response_type: 'id_token',
//        scope: 'allatclaims',
        scope: 'openid',
        response_mode: 'form_post',
        extraQueryParams: {
            nonce: '12345'
        }
    };
    var userManager = new Oidc.UserManager(config);

    setTimeout(function() {
        userManager.signinRedirect().catch(function(error) {
            alert("error - " + error);
        });
      }, 2000);
    */
}

function loadPage(pageUrl, responseFunc) {
    $.ajax({
        url: pageUrl,
        dataType: 'html',
        success: function (data) {
            $("#requestsSection").show();
            $("#requestsSection").html(data);
            var title = $('#requestsSection').find('title').text();
            $("#pageTitle").html(" - " + title);

            if (responseFunc !== undefined) {
                responseFunc();
            }
        },
        error: function (result) {
        },
    });
}

function getCryptoRandomBetween(min, max){
    var MAX_VAL = 4294967295;
    var numberOfRandomsNeeded = Math.ceil((max - min) / MAX_VAL);
    var cryptoRandomNumbers = new Uint32Array(numberOfRandomsNeeded);
    crypto.getRandomValues(cryptoRandomNumbers);
    for(var i = 0, sum = 0; i < cryptoRandomNumbers.length; i++){
      sum += cryptoRandomNumbers[i];
    }
    var randomDecimal = sum / (MAX_VAL * numberOfRandomsNeeded);
    return randomDecimal === 1 ? getCryptoRandomBetween(min, max) : Math.floor(randomDecimal * (max - min + 1) + min);
}
  
function getRandomChar(str){
    return str.charAt(getCryptoRandomBetween(0, str.length - 1));
}
  
String.random = function(length) {
    var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+;<>?";
    for(var i = 0, str = ""; i < length; i++) str += getRandomChar(characters);
    return btoa(str);
};

function generateUUID() {
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
