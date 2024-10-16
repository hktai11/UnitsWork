$(document).ready(function() {
    closeRequestDetails();
    getUserRequests();
});

function setupTableCell(content) {
    var cell = $('<td>');
    var div = $('<div>');
    div.addClass('cell');
    div.text(content);
    cell.append(div);
    return cell;
}

function getUserRequests() {
    var data = {
         sessionID: sessionID
     }
     var url = webApiBaseUrl + 'api/values/GetUserRequests';
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
                var row = $('<tr>');
                row.attr('data-id', requests[i].requestID.toString());
                row.attr('data-formType', requests[i].type);
                row.attr('onclick','showRequestDetails(this); return false;');
                row.append(setupTableCell(requests[i].ticketID));
                row.append(setupTableCell(requests[i].type));
                row.append(setupTableCell(requests[i].status));
                row.append(setupTableCell(requests[i].submissionDate));
                 $('#requestsTable').append(row);
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

function showCreateNewSiteDetails(data) {
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
                $("#requestDetails").show();
                var form = $("#requestDetails");
                form.find("#user").val(result.userName);
                form.find("#orgdiv").val(result.department_division);
                form.find("#sitetype").val(result.siteType);
                form.find("#appcode").val(result.appCode);
                form.find("#sitestorage").val(result.siteStorage);
                form.find("#sitename").val(result.siteName);
                form.find("#sitetitle").val(result.siteTitle);
                form.find("#remark").val(result.remark);
                form.find("#approverRemark").val(result.approverRemark);

                form.find("#remark").height(form.find("#remark")[0].scrollHeight);
                form.find("#approverRemark").height(form.find("#approverRemark")[0].scrollHeight);
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

function showChangeSiteQuotaDetails(data) {
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
                $("#changeSiteQuotaDetails").show();
                var form = $("#changeSiteQuotaDetails");
                form.find("#sitename").val(result.siteName);
                form.find("#sitetitle").val(result.siteTitle);
                form.find("#appcode").val(result.appCode);
                form.find("#sitestorage").val(result.siteStorage);
                form.find("#remark").val(result.remark);
                form.find("#approverRemark").val(result.approverRemark);

                form.find("#remark").height(form.find("#remark")[0].scrollHeight);
                form.find("#approverRemark").height(form.find("#approverRemark")[0].scrollHeight);
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

function showRequestDetails(elem) {
    closeRequestDetails();
    $('.requestsSection').find('tr').removeClass('selected');    
    $(elem).addClass('selected');    
    var formType = $(elem).attr('data-formType');
    var requestID = parseInt($(elem).attr('data-id'));
    var data = {
        sessionID: sessionID,
        requestID: requestID
    }
    if (formType == "New Site") {
        showCreateNewSiteDetails(data);
    }
    else if (formType == "New Quota") {
        showChangeSiteQuotaDetails(data);
    }
}

function closeRequestDetails() {
    $(".requestDetails").hide();
}
