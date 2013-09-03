'use strict';

module.exports = {

    _errorColor     : '\u001b[31m',
    _successColor   : '\u001b[32m',
    _defaultColor   : '\u001b[0m',

    success: function (message) {
        'use strict';
        console.log(this._successColor + message + this._defaultColor);
    },

    error: function (message) {
        'use strict';
        console.log(this._errorColor + message + this._defaultColor);
    }
};