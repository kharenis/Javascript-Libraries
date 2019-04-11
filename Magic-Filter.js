///                                           ///
///      Developed by Richard Smothers        ///
///                                           ///
var MagicFilter =
{
    Initialise: function (combineFilters = true, allowPartialMatch = true, filterClass = '.magic-filter', containerClass = '', callback) {
        var filters = $(filterClass);

        filters.change(function () {

            $(containerClass + ' .magic-filter-match').removeClass('magic-filter-match');
            $(containerClass + ' .magic-filter-no-match').removeClass('magic-filter-no-match');

            for (var filterCount = 0; filterCount < filters.length; filterCount++) {
                var filterValue = $(filters[filterCount]).val();

                if (!filterValue || filterValue === '') continue;

                var filterFor = $(filters[filterCount]).data('filter-for');

                var matchedElements = $(containerClass + ' [data-' + filterFor + ']');

                for (var elementCount = 0; elementCount < matchedElements.length; elementCount++) {
                    var element = matchedElements[elementCount];
                    var elementValue = $(element).data(filterFor);

                    var match = MagicFilter.isMatch(filterValue, elementValue, allowPartialMatch);

                    if (combineFilters && !match)
                        $(matchedElements[elementCount]).removeClass('magic-filter-match').addClass('magic-filter-no-match');
                    else
                        if (!combineFilters && match)
                            $(matchedElements[elementCount]).removeClass('magic-filter-no-match').addClass('magic-filter-match');

                }
                if (callback)
                    callback();
            }
        });
    },

    //Checks if value2 is equal to, or if applicable, contains value1
    isMatch: function (value1, value2, allowPartial) {
        value1 = (value1 + '').toLowerCase();
        value2 = (value2 + '').toLowerCase();
        return (value1 === value2 || (allowPartial && value2.indexOf(value1) >= 0));
    },

    Filter: function (filterContainerSelector, targetContainerSelector, combineFilters = true, allowPartialMatch = true) {
        var filters = $(filterContainerSelector + ' [data-filter-for]');

        var validElements = new Array();

        filters.each(function (filterCount, filterElement) {
            var filterTarget = $(this).data('data-filter-for');
            var filterValue = $(this).val();

            var matchingElements = $('[data-' + filterTarget + ']');
            var matchedElements = new Array();
            matchingElements.each(function (matchingElementCount, matchingElement) { //Iterate the elements that this filter is applying to
                var elementValue = $(this).data(filterTarget); //Get the value of the element

                if ((allowPartialMatch && elementValue.includes(filterValue)) || (elementValue === filterValue))
                    matchedElements.push($(this)); //Check if the element value matches the filter
            });

            validElements.push(matchedELements);
            //var matchingElements = $(targetContainerSelector + ' [data-filter-for="' + filterTarget + '"]');
        });

        //Iterate through validElements and combine the arrays as appropriate


    }
};