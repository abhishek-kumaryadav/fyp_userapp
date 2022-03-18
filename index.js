// API CODE

function addPdf() {
    var file = document.getElementById("pdfFile").files[0];
    getBase64(file, addPdfApi);
    return false;
}

function addPdfApi(base64String, fileName) {
    if (base64String == false) {
        console.log("Error opening file: ", response);
        return false;
    }
    var jsonString = {
        "base64String": base64String,
        "fileName": fileName
    }
    var url = getPdfUrl();
    jsonData = JSON.stringify(jsonString);
    console.log(jsonData);
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(jsonData),
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (response) {
            getPdfList();
            refreshPdfList();
            document.getElementById("add-pdf").disabled = true;

        },
        error: function (response) {
            console.log("Error Uploading file: ", response);
        }
    });
    return false;
}

function downloadPdf(name) {
    var url = getPdfUrl() + "/" + name;
    $.fileDownload(url);
}

function getPdfList() {
    var url = getPdfUrl();
    $.ajax({
        url: url,
        type: 'GET',
        crossDomain: true,
        success: function (data) {
            displayPdfList(data);
        },
        error: function (e) {
            console.log(e);

        }
    });
}

function deletePdf(name) {
    var url = getPdfUrl() + "/" + name;
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function (data) {
            console.log(typeof (data));
            getPdfList();
        },
        error: function (e) {
            console.log(e);
        }
    });

}

// UTILITY CODE

function getBase64(file, myCallBack) {
    var retval;
    const reader = new FileReader();
    const fileByteArray = [];
    reader.readAsArrayBuffer(file);
    reader.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) {
            const arrayBuffer = evt.target.result,
                array = new Uint8Array(arrayBuffer);
            for (const a of array) {
                fileByteArray.push(a);
            }
            var b64Str = fileByteArray.toString();
            myCallBack(b64Str, file.name);
        }
    }
    reader.onerror = function (error) {
        console.log('Error: ', error);
        myCallBack(false, false);
    };
    return retval;
}

function getPdfUrl() {
    return "http://127.0.0.1:5000/pdf"
}

function refreshPdfList() {
    document.getElementById("pdfFile").value = "";
    getPdfList();
}

// DISPLAY CODE

function displayPdfList(data) {
    data = JSON.parse(data);
    console.log(data);
    var $tbody = $('#pdf-table').find('tbody');
    $tbody.empty();
    var sno = 1;
    for (var i in data) {
        var e = data[i];
        var buttonHtml = ' <button type="button" class="btn btn-secondary btn-sm" onclick="downloadPdf(\'' + e.name + '\')">Download</button>'
        buttonHtml += ' <button type="button" class="btn btn-danger btn-sm" onclick="deletePdf(\'' + e.name + '\')">Delete</button>'

        var row = '<tr>'
            + '<td>' + sno + '</td>'
            + '<td>' + e.name + '</td>'
            + '<td>' + buttonHtml + '</td>'
            + '</tr>';
        sno += 1;
        $tbody.append(row);
    }
}

//INITIALIZATION CODE

function init() {
    $('#pdf-form').submit(addPdf);
    $('#refresh-pdf-data').click(refreshPdfList);
    document.getElementById('pdfFile').addEventListener('input', function (evt) {
        var file = $('#pdfFile')[0].files[0];
        try {
            if (file.name != null) {
                document.getElementById("add-pdf").disabled = false;
            }
        }
        catch (err) {
            document.getElementById("add-pdf").disabled = true;
        }
    });
}

$(document).ready(init);
$(document).ready(getPdfList);

