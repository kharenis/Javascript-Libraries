/*
 * Developed by Richard Smothers
 * Creates a right-click context menu for the given elements.
 * eg. Bind('#myElement', [{text: 'Menu item 1', click: myFunction}, {text: 'Menu item 2', click: mySecondFunction}])
 */
var Contextify =
{
    Bind: function (jquerySelector, menuModel) {
        var menuContainer = document.createElement('div');
        menuContainer.classList.add('right-click-menu');

        $('body').append(menuContainer);

        for (var count = 0; count < menuModel.length; count++) { //Iterate through the menu items
            var menuItem = document.createElement('div');
            menuItem.innerHTML = menuModel[count].text;

            var clickHandler = menuModel[count].click;

            $(menuItem).click((function (clickHandler) {
                return function () {
                    clickHandler(menuContainer.caller);
                };
            })(clickHandler));

            menuContainer.appendChild(menuItem);
        }

        $(jquerySelector).contextmenu(function (event) {
            event.preventDefault();
            $(menuContainer).hide();
            menuContainer.style.top = cursorPosition.Y + 'px';
            menuContainer.style.left = cursorPosition.X + 'px';
            menuContainer.caller = this;
            $(menuContainer).show();
        });

        $(menuContainer).mouseleave(function () {
            $(menuContainer).hide();
        });
    }
};

//Track the cursor position so we know where to pop up the context menu. Unfortunately this seems to be the only way to do it.
var cursorPosition = new Object();
$(function () {
    $(document).on('mousemove', function (e) {
        cursorPosition.X = e.pageX;
        cursorPosition.Y = e.pageY;
    });
});