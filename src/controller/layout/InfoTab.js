Ext.define('Planche.controller.layout.InfoTab', {
    extend  : 'Ext.app.Controller',
    prevNode: null,
    init    : function() {

        var app = this.getApplication();

        this.control({
            'info-tab'   : {
                show: function(grid) {

                    var node = app.getSelectedNode(true);

                    if (this.prevNode == node) {

                        return;
                    }

                    this.prevNode = node;

                    this.openInfo(node);
                }
            },
            'schema-tree': {
                select: function(view) {

                    var treeview = view.views[0],
                        tree = treeview.up("treepanel");

                    app.setSelectedTree(tree);

                    var node = app.getSelectedNode(true);

                    this.openInfo(node);
                }
            }
        });
    },

    openInfo: function(node) {

        var app = this.getApplication(),
            type = node.raw.type,
            db = app.getSelectedDatabase(),
            table = app.getSelectedTable(),
            func = 'export' + type.charAt(0).toUpperCase() + type.slice(1) + 'InfoToHTML',
            util = Planche.SchemaUtil;

        if (util[func]) {

            var info = app.getActiveInfoTab();
            if (info.isVisible()) {

                util[func](db, table, info, 'update');
            }
        }
    }
});