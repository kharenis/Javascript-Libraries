$(function () {
    bindUnobtrusiveAjax();
});

function bindUnobtrusiveAjax() {
    var activatedElements = $('[data-ajax="true"]');

    activatedElements.not('form').on('click', function (event) {
        makeAjaxRequest(this);
    });

    activatedElements.filter('form').on('submit', function (event) {
        event.preventDefault();
        makeAjaxRequest(this);
        return false;
    });
}

function makeAjaxRequest(element) {
    var ajaxMethod = $(element).data('ajax-method');
    if (!ajaxMethod)
        ajaxMethod = "get";
    var ajaxMode = $(element).data('ajax-mode');
    if (!ajaxMode)
        ajaxMode = "replace";

    var ajaxLoading = $(element).data('ajax-loading');
    var ajaxComplete = $(element).data('ajax-complete');
    var ajaxFailure = $(element).data('ajax-failure');
    var ajaxUpdate = $(element).data('ajax-update');

    var ajaxUrl = $(element).data('ajax-url');
    if (!ajaxUrl)
        ajaxUrl = window.location.href;

    var request = null;

    if (ajaxLoading)
        $(ajaxLoading).show();

    if (ajaxMethod === "get") {
        request = Ajax.Get(ajaxUrl, {}, "html");
    }
    else if (ajaxMethod === "post") {
        request = Ajax.PostForm(element, ajaxUrl, "html");
    }

    request.always(function () {
        $(ajaxLoading).hide();
    });

    request.done(function (data) {

        if (ajaxUpdate) {
            switch (ajaxMode) {
                case "before":
                    $(ajaxUpdate).prepend(data);
                    break;
                case "afer":
                    $(ajaxUpdate).append(data);
                    break;
                default:
                    $(ajaxUpdate).empty();
                    $(ajaxUpdate).append(data);
                    break;
            }
        }

        bindUnobtrusiveAjax();
        if (ajaxComplete)
            window[ajaxComplete](data);
    });

    request.fail(function (error) {
        $(ajaxUpdate).empty();
        $(ajaxUpdate).append(error.responseText);

        if (ajaxFailure)
            window[ajaxFailure](error);

        bindUnobtrusiveAjax();
    });
}
