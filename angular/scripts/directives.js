angular.module("angularRestfulAuth")
 .directive('popoverEl', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs) {
            //$(element).toolbar(scope.$eval(attrs.toolbarTip));
			$(element).popover(scope.$eval(attrs.popoverEl));
        }
    };
})