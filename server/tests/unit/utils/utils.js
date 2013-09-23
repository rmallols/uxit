'use strict';
var routeParams = {
    portal: 'uxitDev',
    page: 'Home'
}, NProgress = {
    configure: function(){},
    start: function(){},
    done: function(){}
};

function trim(str) {
    return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
}

function isVisible(elm) {
    return elm.css('display') !== 'none';
}
