$(document).ready(function() {
    closeAdminPageForm();
    getAdminPageRequests();
});

function setupTableCell(content) {
    var cell = $('<td>');
    var div = $('<div>');
    div.addClass('cell');
    div.text(content);
    cell.append(div);
    return cell;
}

function setupTableCellLink(content) {
    var cell = $('<td>');
    var div = $('<div>');
    div.addClass('cell');
    div.text(content);
    cell.append(div);
    return cell;
}

function getAdminPageRequests() {
    $('#adminPageTable').html('');
    var data = {
         sessionID: sessionID
     }
     var url = webApiBaseUrl + 'api/values/GetAdminPageItems';
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
             var items = result.items;
             for (var i = 0; items.length; i++) {
                var row = $('<tr data-id="' + items[i].ID.toString() + '">');
                row.attr('data-id', items[i].ID.toString());
                row.attr('onclick','showAdminPageForm(this); return false;');
                row.append(setupTableCell(items[i].ID.toString()));
                row.append(setupTableCell(items[i].division));
                row.append(setupTableCell(items[i].siteName));
                row.append(setupTableCell(items[i].siteTitle));
                row.append(setupTableCellLink(items[i].siteSize));
                row.append(setupTableCell(items[i].lastModified));
                 $('#adminPageTable').append(row);
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
 
function showAdminPageForm(elem) {
    $('.adminPageSection').find('tr').removeClass('selected');    
    $(elem).addClass('selected');    
    $("#adminPageForm").hide();
    var siteID = parseInt($(elem).attr('data-id'));
    var data = {
        sessionID: sessionID,
        siteID: siteID
    }
    var url = webApiBaseUrl + 'api/values/GetChangeSiteQuotaFormDefaults';
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
                $("#adminPageForm").show();
                enableAdminPageForm();
                var form = $("#adminPageForm");
                form.attr("data-siteID", siteID);
                form.find("#sitename").val(result.siteName);
                form.find("#sitetitle").val(result.siteTitle);

                form.find("#sitestorage").val("500");

                for (var i = 0; i < result.admins.length; i++) {
                    $('#siteadmin').append($('<option>', {
                        value: result.admins[i].userID,
                        text: result.admins[i].userName
                    }));
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

function closeAdminPageForm() {
    $("#adminPageForm").hide();
}

function submitForm() {
    var form = $("#adminPageForm");
    var formArray = form.serializeArray();
    var formData = {};
    $.each(formArray, function(i, v) {
        formData[v.name] = v.value;
    });
    formData['sessionID'] = sessionID;
    formData['siteid'] = form.attr("data-siteID");
    formData['sitename'] = form.find('#sitename').val();
    formData['sitetitle'] = form.find('#sitetitle').val();

    var jsonData = JSON.stringify(formData);

    form.find("#sitestorage").prop("disabled", true);
    form.find("#siteadmin").prop("disabled", true);
    form.find("#appcode").prop("disabled", true);
    form.find("#remark").prop("disabled", true);
    form.find("button").prop("disabled", true);

    submitChangeSiteQuotaForm(jsonData);
}

function submitChangeSiteQuotaForm(data) {
    var url = webApiBaseUrl + 'api/values/SubmitChangeSiteQuotaForm';
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
                closeAdminPageForm();
            }
            else {
                enableAdminPageForm();
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

                enableAdminPageForm();
            }
        }
    });
}

function enableAdminPageForm() {
    var form = $("#adminPageForm");
    form.find("#sitestorage").prop("disabled", false);
    form.find("#siteadmin").prop("disabled", false);
    form.find("#appcode").prop("disabled", false);
    form.find("#remark").prop("disabled", false);
    form.find("button").prop("disabled", false);
}

