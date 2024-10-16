$(document).ready(function() {

    $('#sitetype').change(function() {
        var siteName = $("#sitename").val();
        var index = siteName.indexOf("-");  
        var org = siteName.slice(0, index);
        var part = siteName.slice(index + 1);

        index = part.indexOf("-");  
        var div = part.slice(0, index);
        part = part.slice(index + 1);

        index = part.indexOf("-");  
        part = part.slice(index + 1);
        
        siteName = org + '-' + div + '-' + $("#sitetype").val() + '-' + part; 
        $("#sitename").val(siteName);
    });

    var data = {
        sessionID: sessionID
    }
    var url = webApiBaseUrl + 'api/values/GetCreateNewSiteFormDefaults';
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
            if (result.status == "success") {
                $("#createNewSiteForm").show();
                $("#user").val(result.userName);
                $("#orgdiv").val(result.departmentDivision);

                var siteName = result.siteName;
                var index = siteName.indexOf("-");  
                var org = siteName.slice(0, index);
                var part = siteName.slice(index + 1);
        
                index = part.indexOf("-");  
                var div = part.slice(0, index);
                part = part.slice(index + 1);

                siteName = org + '-' + div + '-' + $("#sitetype").val() + '-' + part; 
                $("#sitename").val(siteName);

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

    $("#createNewSiteForm").submit(function(event) {
        event.preventDefault();

        $('#sitename').prop("disabled", false); 
        var siteName = $('#sitename').val(); 
        $('#sitename').prop("disabled", true)
        var form = $(this);
        var formArray = form.serializeArray();
        var formData = {};
        $.each(formArray, function(i, v) {
            formData[v.name] = v.value;
        });

        if (formData['siteadmin'] == null || formData['siteadmin'].trim() == '') {
            alert('No adminstrator selected!');
        }
        else {
            formData['sessionID'] = sessionID;
            formData['sitename'] = siteName;
            var jsonData = JSON.stringify(formData);
            form.find("input").prop("disabled", true);
            form.find("select").prop("disabled", true);

            submitCreateNewSiteForm(jsonData);
    
        }
    });

    $("#createNewSiteForm").hide();
});

function enableCreateNewSiteForm() {
    $("#createNewSiteForm").find("input").prop("disabled", false);
    $("#createNewSiteForm").find("textarea").prop("disabled", false);
    $("#createNewSiteForm").find("select").prop("disabled", false);
}

function submitCreateNewSiteForm(data) {
    var url = webApiBaseUrl + 'api/values/SubmitCreateNewSiteForm';
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
          
//            alert(result.status);

            if (result.status == "success") {
                exitPage();
            }
            else {
                enableCreateNewSiteForm();
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

                enableCreateNewSiteForm();
            }
        }
    });
}