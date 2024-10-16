
var getUserIDPageUrl = 'http://localhost:5501';

var nonce;

$(function() {
   $(".sitesContainer").hide();
   window.addEventListener('message', function(event) {
      if (event.data.split(' ')[0] == nonce) {
         var userID = event.data.substr(event.data.indexOf(" ") + 1);
         showAllSites(userID);
      }
   });

   var sessionID = getUrlParameter('sessionID');
    createUserSession(sessionID, userSessionCallback);
});

function openPortalPage(elem) {
   var baseUrl = window.location.origin + '/';
   var landingUrl = baseUrl + 'index.html?state=1';
   window.open(landingUrl, '_blank');
}

function openAllSitesPage(elem) {
   $(".portalTab").removeClass('selected');
   $(elem).addClass('selected');

   /*
   var baseUrl = window.location.origin + '/';
   var landingUrl = baseUrl + 'index.html?state=2';
   window.open(landingUrl, '_blank');
   */

   nonce = randomString(48, '#a');
   var width = 500;
   var height = 300;
   var left = (window.innerWidth - width) / 2;
   var top = (window.innerHeight - height) / 2;
   window.open(getUserIDPageUrl + '?state=1&nonce=' + nonce, 'Page', 'width=' + width.toString() + ', height=' + height.toString() + ', left=' + left.toString() + ', top=' + top.toString());
}

function openRecentSitesPage(elem) {

   /*
   $(".portalTab").removeClass('selected');
   $(elem).addClass('selected');

   var baseUrl = window.location.origin + '/';
   var landingUrl = baseUrl + 'index.html?state=3';
   window.open(landingUrl, '_blank');
   */

/*
   var testString = `
   <div class="w3-bar w3-white">
      <a class="w3-bar-item w3-button portalTab"
         onclick="openAllSitesPage(this); return false;">Show All Sites</a>
      <a class="w3-bar-item w3-button portalTab"
         onclick="openRecentSitesPage(this); return false;">Show Recent Sites</a>
      <a class="w3-bar-item w3-button portalTab"
         onclick="openPortalPage(this); return false;">Sharepoint Portal</a>
   </div>
   `;

   alert(testString);
   */
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

function showAllSites(userID) {
   $('.sitesContainer').hide();
   $('.siteBody').html("");
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
            $('#allSitesContainer').show();
            var userSites = result.userSites;

            var divisionTeamSitesCount = 0;
            var myTeamSitesCount = 0;

        //    for (var j = 0; j < 50; j++) {

            for (var i = 0; i < userSites.length; i++) {
               if (userSites[i].siteType == 1) {
                  var htmlString = siteElement(userSites[i].siteName, userSites[i].siteUrl, 
                     userSites[i].siteType.toString(), (myTeamSitesCount + 1).toString());
                  $('#allSitesContainer').find('.myTeamSites').append(htmlString);
                  myTeamSitesCount++
               }
               else {
                  var htmlString = siteElement(userSites[i].siteName, userSites[i].siteUrl, 
                     userSites[i].siteType.toString(), (divisionTeamSitesCount + 1).toString());
                  $('#allSitesContainer').find('.divisionTeamSites').append(htmlString);
                  divisionTeamSitesCount++;
               }
            }

            $('.siteItem').each(function(index, value) {
               var index = parseInt($(this).attr('data-index'));
               if (index > 9) {
                  $(this).hide();
               }
            });

            if (divisionTeamSitesCount > 9) {
               $('#allSitesContainer').find('.divisionTeamMoreSites').show();
            }
            else {
               $('#allSitesContainer').find('.divisionTeamMoreSites').hide();
            }
            if (myTeamSitesCount > 9) {
               $('#allSitesContainer').find('.myTeamMoreSites').show();
            }
            else {
               $('#allSitesContainer').find('.myTeamMoreSites').hide();
            }
   
    //       }
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

function openSite(elem) {
   var siteUrl = $(elem).attr('data-siteUrl');
   window.open(siteUrl, '_blank');
}

function siteElement(siteName, siteUrl, siteType, index) {
   var htmlString = 
   '<div class="siteItem" style="float: left; display: table; width: calc(30% - 20px); cursor:pointer;' +
               'border-spacing: 0 0; padding: 0; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 15px;"' +
               'data-siteUrl="' + siteUrl + '"' +
               'data-siteType="' + siteType + '"' +
               'data-index="' + index + '"' +
               'onclick="openSite(this); return false;">' +
      '<div style="display: table-cell; vertical-align: top;">' +
         '<div style="display: table; border-spacing: 0 0;">' +
            '<div style="display: table-row;">' +
               '<div style="display: table-cell; vertical-align: top;">' +
                  '<div style="width: 10px; height: 10px; margin-right: 3px; margin-bottom: 3px; background-color: goldenrod;"></div>' +
               '</div>' +
               '<div style="display: table-cell; vertical-align: top;">' +
                  '<div style="width: 10px; height: 10px; margin-right: 3px; margin-bottom: 3px; background-color: goldenrod;"></div>' +
               '</div>' +
            '</div>' +
            '<div style="display: table-row;">' +
               '<div style="display: table-cell; vertical-align: top;">' +
                  '<div style="width: 10px; height: 10px; margin-right: 3px; margin-bottom: 3px; background-color: goldenrod;"></div>' +
               '</div>' +
               '<div style="display: table-cell; vertical-align: top;">' +
                  '<div style="width: 10px; height: 10px; margin-right: 3px; margin-bottom: 3px; background-color: goldenrod;"></div>' +
               '</div>' +
            '</div>' +
         '</div>' +
      '</div>' +
      '<div style="display: table-cell; width: 100%; vertical-align: top;">' +
         '<div style="width: 100%; padding-left: 5px; word-wrap: break-word; text-align: left">' + siteName + '</div>' +
      '</div>' +
   '</div>';

   return htmlString;
}

function userSessionCallback(result) {
   sessionID = result.sessionID;
   var userName = result.userName;
   if (result.userType.toLowerCase().trim() == 'admin') {
       userName = userName + ' (Admin)';
   }
   $("#currentUserName").text(userName);
   $("#currentUserDepartmentDivision").text(result.department + ' / ' + result.division);
}

function showMoreSites(type) {
   if (type == 1) {
      $('.myTeamSites').find('.siteItem').show();
      $('.myTeamMoreSites').hide();
   }
   else if (type == 2) {
      $('.divisionTeamSites').find('.siteItem').show();
      $('.divisionTeamMoreSites').hide();
   }
}
