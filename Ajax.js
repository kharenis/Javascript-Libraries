class Ajax {
    static Get(url, data = {}, responseDataType = '') {
        return $.ajax({
            type: 'GET',
            url: url,
            data: data,
            contentType: 'application/json; charset-utf8',
            dataType: responseDataType
        });
    }

    static Post(url, data = {}, responseDataType = '') {
        return $.ajax({
            type: 'POST',
            url: url,
            data: data,
            contentType: 'application/json; charset-utf8',
            dataType: responseDataType
        });
    }

    static PostForm(formSelector, url, responseDataType = '') {

        var formData = getFormData(formSelector);

        return $.ajax({
            type: 'POST',
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            dataType: responseDataType
        });
    }
}

function getFormData(formSelector) {
    var form = $(formSelector);
    var elements = form.find('input, select, textarea');

    var formData = new FormData();

    elements.each(function (i, obj) {
        switch (obj.type) {
            case 'file':
                {
                    formData.append(obj.id, $(this)[0].files[0]);
                }
                break;
            default:
                {
                    if ($(this).is('select') && $(this).prop('multiple')) {
                        var selectedValues = $(this).val();
                        for (var x = 0; x < selectedValues.length; x++) {
                            formData.append(obj.id, selectedValues[x]);
                        }
                    }
                    else
                        formData.append(obj.id, $(this).val());
                }
                break;
        }
    });

    return formData;
}