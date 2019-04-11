/*
 * Developed by Richard Smothers
 * Used for displaying Bootstrap 4 Modals
 */
var Modal = {
    Display: function (title, htmlBody, displayedCallback, submitCallback, cancelCallback) {

        //Get the content of the template
        var templateContent = document.querySelector('#modal-template').content;

        var templateContainer = document.querySelector('#dynamic-modal');

        //Import the content into a new node, and append it to the container
        templateContainer.appendChild(document.importNode(templateContent, true));


        //Get a reference for the newly inserted node. - Any previous references are invalid!!
        var $template = $(templateContainer).find('.modal');

        $template.find('.modal-title').text(title);
        $template.find('.modal-body').append(htmlBody);

        if (submitCallback)
            $template.find('.modal-submit').click(function () {
                submitCallback($template);
            });
        if (cancelCallback)
            $template.find('.modal-cancel').click(function () {
                cancelCallback($template);
            });

        //Remove the modal elements when it's closed.
        $template.find('.modal-submit, .modal-cancel').click(function () {
            $('.modal-backdrop').remove();
            $template.remove();
        });

        $template.modal();

        if (displayedCallback)
            displayedCallback($template);
    }
};