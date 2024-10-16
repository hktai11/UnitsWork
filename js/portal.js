$(function() {
    $(".pageContainer").hide();
    var sessionID = getUrlParameter('sessionID');
    createUserSession(sessionID, userSessionCallback);
    /*
    if (code == "") {
        $("#loginForm").show();
    }
    else {
        $("#loginForm").hide();
        createUserSession(code);
    }
    */
});

function exitPage() {
    $(".portalTab").removeClass('selected');
    $("#pageTitle").html("");
    $(".sectionAbsoluteContainer").html("");
}

function validateToken(elem) {
    $(".portalTab").removeClass('selected');
    $(elem).addClass('selected');

    var data = {
        sessionID: sessionID
    }
    var url = webApiBaseUrl + 'api/values/ValidateToken';
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

            alert(result.status);

        },
        error: function (xhr, status, error) {
            // Handle error response
            alert(xhr.status); // HTTP status code
            //                    alert(xhr.responseText); // Response body
            alert(error); // Error message
        }
    });
}

function navigateToRequests(elem) {
    $(".portalTab").removeClass('selected');
    $(elem).addClass('selected');
    loadPage("./requests.html");
}

function navigateToActionRequire(elem) {
    $(".portalTab").removeClass('selected');
    $(elem).addClass('selected');
    loadPage("./actionRequire.html");
}

function navigateToCreateNewSite(elem) {
    $(".portalTab").removeClass('selected');
    $(elem).addClass('selected');
    loadPage("./createNewSite.html");
}

function navigateToAdminPage(elem) {
    $(".portalTab").removeClass('selected');
    $(elem).addClass('selected');
    loadPage("./adminPage.html");
}

function navigateToStorageAdjust() {
//    window.location.href = "storageAdjust.html";
}

function navigateToSiteBackup() {
//   window.location.href = "siteBackup.html";
}

function navigateToSitePermission() {
//    window.location.href = "sitePermission.html";
}

function navigateToRequestStatus() {
//   window.location.href = "requestStatus.html";
}

function navigateToAuthenticationPage() {
    window.location.href = "./index.html";
}

function loadPage(pageUrl) {
    $.ajax({
        url: pageUrl,
        dataType: 'html',
        success: function (data) {
            $(".sectionAbsoluteContainer").show();
            $(".sectionAbsoluteContainer").html(data);
            var title = $('.sectionAbsoluteContainer').find('title').text();
            $("#pageTitle").html(" - " + title);
        },
        error: function (result) {
        },
    });
}

function userSessionCallback(result) {
    sessionID = result.sessionID;
    var userName = result.userName;
    if (result.userType.toLowerCase().trim() == 'admin') {
        userName = userName + ' (Admin)';
        $("#navigateToActionRequire").show();
    }
    $("#currentUserName").text(userName);
    $("#currentUserDepartmentDivision").text(result.department + ' / ' + result.division);
}
