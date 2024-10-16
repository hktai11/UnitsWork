$(document).ready(function() {
    closeActionRequireForm();
    getActionRequireRequests();
});

function setupTableCell(content) {
    var cell = $('<td>');
    var div = $('<div>');
    div.addClass('cell');
    div.text(content);
    cell.append(div);
    return cell;
}

function getActionRequireRequests() {
    $('#actionRequireTable').html('');
    var data = {
         sessionID: sessionID
     }
     var url = webApiBaseUrl + 'api/values/GetActionRequireRequests';
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
             var requests = result.requests;
             for (var i = 0; requests.length; i++) {
                var row = $('<tr data-id="' + requests[i].requestID.toString() + '">');
                row.attr('data-id', requests[i].requestID.toString());
                row.attr('data-formType', requests[i].type);
                row.attr('onclick','showActionRequireForm(this); return false;');
                row.append(setupTableCell(requests[i].ticketID));
                row.append(setupTableCell(requests[i].type));
                row.append(setupTableCell(requests[i].status));
                row.append(setupTableCell(requests[i].submissionDate));
                 $('#actionRequireTable').append(row);
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

function showCreateNewSiteForm(data, requestID) {
    var url = webApiBaseUrl + 'api/values/GetRequestDetails';
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
            if (result.status == 'success') {
                $("#actionRequireForm").show();
                enableActionRequireForm();
                var form = $("#actionRequireForm");
                form.attr("data-requestID", requestID);
                form.find("#orgdiv").val(result.department_division);
                form.find("#sitetype").val(result.siteType);
                form.find("#appcode").val(result.appCode);
                form.find("#sitestorage").val(result.siteStorage);
                form.find("#sitename").val(result.siteName);
                form.find("#sitetitle").val(result.siteTitle);
                form.find("#remark").val(result.remark);
                form.find("#approverRemark").val("");

                form.find("#contentDB").val(result.contentDB);
                if (result.contentDB == "") {
                    form.find("#contentdbquotamessage").text("No Content DB");
                }
                else {
                    form.find("#contentdbquotamessage").text(result.contentDB + " - " + result.contentDBQuota);
                }
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

function showChangeSiteQuotaForm(data, requestID) {
    var url = webApiBaseUrl + 'api/values/GetChangeSiteQuotaRequestDetails';
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
            if (result.status == 'success') {
                $("#changeSiteQuotaForm").show();
                enableActionRequireForm();
                var form = $("#changeSiteQuotaForm");
                form.attr("data-requestID", requestID);
                form.find("#sitename").val(result.siteName);
                form.find("#sitetitle").val(result.siteTitle);
                form.find("#appcode").val(result.appCode);
                form.find("#sitestorage").val(result.siteStorage);
                form.find("#remark").val(result.remark);
                form.find("#approverRemark").val("");

                form.find("#contentDB").val(result.contentDB);
                if (result.contentDB == "") {
                    form.find("#contentdbquotamessage").text("No Content DB");
                }
                else {
                    form.find("#contentdbquotamessage").text(result.contentDB + " - " + result.contentDBQuota);
                }
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
 
function showActionRequireForm(elem) {
    closeActionRequireForm();
    $('.actionRequireSection').find('tr').removeClass('selected');    
    $(elem).addClass('selected');    
    var formType = $(elem).attr('data-formType');
    var requestID = parseInt($(elem).attr('data-id'));
    var data = {
        sessionID: sessionID,
        requestID: requestID
    }
    if (formType == "New Site") {
        showCreateNewSiteForm(data, requestID);
    }
    else if (formType == "New Quota") {
        showChangeSiteQuotaForm(data, requestID);
    }
}

function closeActionRequireForm() {
    $(".actionRequireForm").hide();
}

function approveRequest(elem, actionType) {
    var formID = $(elem).closest('form').attr('id');
    var requestID = parseInt($("#" + formID).attr("data-requestID"));
    var form = $("#" + formID);
    var formArray = form.serializeArray();
    var formData = {};
    $.each(formArray, function(i, v) {
        if (v.name == 'approverRemark') {
            formData[v.name] = v.value;
        }
        else if (v.name == 'contentDB') {
            formData[v.name] = v.value;
        }
    });
    formData['sessionID'] = sessionID;
    formData['requestID'] = requestID;
    formData['actionType'] = actionType;
    var jsonData = JSON.stringify(formData);
    form.find("#approverRemark").prop("disabled", true);
    form.find("button").prop("disabled", true);

    if (formID == "actionRequireForm") {
        submitActionRequireForm(jsonData);
    }
    else if (formID == "changeSiteQuotaForm") {
        submitActionRequireChangeQuotaForm(jsonData);
    }
}

function submitActionRequireForm(data) {
    var url = webApiBaseUrl + 'api/values/SubmitApproveNewSiteForm';
    $.ajax({
        url: url,
        type: "post",
        headers: { 
            Authorization: 'Bearer ' + accessToken, 
        }, 
        contentType: "application/json;charset=utf-8",
        data: data,
        dataType: 'json',
        success: function (result) {
            if (result.status == "success") {
                closeActionRequireForm();
                getActionRequireRequests();
            }
            else {
                enableActionRequireForm();
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
                
                enableActionRequireForm();
            }
        }
    });
}

function submitActionRequireChangeQuotaForm(data) {
    var url = webApiBaseUrl + 'api/values/SubmitApproveChangeSiteQuotaForm';
    $.ajax({
        url: url,
        type: "post",
        headers: { 
            Authorization: 'Bearer ' + accessToken, 
        }, 
        contentType: "application/json;charset=utf-8",
        data: data,
        dataType: 'json',
        success: function (result) {
            if (result.status == "success") {
                closeActionRequireForm();
                getActionRequireRequests();
            }
            else {
                enableActionRequireForm();
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
                
                enableActionRequireForm();
            }
        }
    });
}

function enableActionRequireForm() {
    var form = $("#actionRequireForm");
    form.find("#approverRemark").prop("disabled", false);
    form.find("button").prop("disabled", false);

    form = $("#changeSiteQuotaForm");
    form.find("#approverRemark").prop("disabled", false);
    form.find("button").prop("disabled", false);
}

