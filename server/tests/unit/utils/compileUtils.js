'use strict';
function compileFn($compile, $scope, $document) {
    var element = angular.element, container;

    function getContainer($document) {
        var body = element($document[0].body),
            containerDiv = element('div.container', body);

        if (containerDiv.length > 0) {
            containerDiv.empty();
        } else {
            containerDiv = element('<div class="container"></div>');
            body.append(containerDiv);
        }

        return containerDiv;
    }

    if ($document) {
        container = getContainer($document);
    }

    return function (html, values) {
        values = values || {};
        var elm = $compile(html)(angular.extend($scope, values));
        $scope.$digest();

        if (container) {
            container.append(elm);
        }

        return elm;
    };
}