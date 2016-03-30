Ext.define('Planche.controller.menu.Tools', {
    extend: 'Planche.lib.Menu',
    add   : function(topBtn) {

        topBtn.menu.add([{
            text        : 'User Manager',
            scope       : this.application,
            handler     : function() {

                this.openUserPanel();
            },
            allowDisable: function(topBtn, menu) {

                if (!this.getActiveConnectTab()) {

                    return true;
                }

                return false;
            }
        }, {
            text        : 'Flush',
            scope       : this.application,
            handler     : function() {

                this.openFlushPanel();
            },
            allowDisable: function(topBtn, menu) {

                if (!this.getActiveConnectTab()) {

                    return true;
                }

                return false;
            }
        }, {
            text        : 'Open Quick Command',
            scope       : this.application,
            handler     : function() {

                this.openQuickPanel();
            },
            allowDisable: function(topBtn, menu) {

                if (!this.getActiveConnectTab()) {

                    return true;
                }

                return false;
            }
        }, {
            text        : 'Show Process List',
            scope       : this.application,
            handler     : function() {

                this.openProcessPanel();
            },
            allowDisable: function(topBtn, menu) {

                if (!this.getActiveConnectTab()) {

                    return true;
                }

                return false;
            }
        }, {
            text        : 'Show Variables',
            scope       : this.application,
            handler     : function() {

                this.openVariablesPanel();
            },
            allowDisable: function(topBtn, menu) {

                if (!this.getActiveConnectTab()) {

                    return true;
                }

                return false;
            }
        }, {
            text        : 'Show Status',
            scope       : this.application,
            handler     : function() {

                this.openStatusPanel();
            },
            allowDisable: function(topBtn, menu) {

                if (!this.getActiveConnectTab()) {

                    return true;
                }

                return false;
            }
        }]);

        this.added = true;
    }
});
