(function() {
    'use strict';

    var execSetup   = require('../../execSetup.js'),
        listCO      = require('../components/list.cO.js');

    module.exports = {

        _ptor: execSetup.getPtor(),
        _protractor: execSetup.getProtractor(),

        getPortalsList: function() {
            return this._ptor.findElement(this._protractor.By.css('[app-bridge][src="portalsAdminApp"]'));
        },

        showCreatePortalEditBox: function() {
            listCO.showCreateEditBox();
            return this;
        },

        getCreatePortalEditBox: function() {
            return  this._ptor.findElement(this._protractor.By.css("[app-bridge].portalsAdminEditDb"));
        },

        createPortal: function(portalName) {
            this._setPortalData(portalName);
            return this;
        },

        editPortal: function(portalName) {
            this._setPortalData(portalName);
            return this;
        },

        getItemsTitles: function() {
            return listCO.getItemsTitles('h5');
        },

        getItemEditElms: function() {
            return listCO.getItemEditElms();
        },

        getItemSelectorElms: function() {
            return listCO.getItemSelectorElms();
        },

        getDeleteItemsButtonElm: function() {
            return listCO.getDeleteItemsButtonElm();
        },

        _setPortalData: function(portalName) {
            var saveButtonElm, portalNameElm;
            saveButtonElm   = this._ptor.findElement(this._protractor.By.css(".editBox button.saveIcon"));
            portalNameElm   = this._ptor.findElement(this._protractor.By.input("model.typedName"));
            portalNameElm.clear();
            portalNameElm.sendKeys(portalName);
            saveButtonElm.click();
        }
    };
})();