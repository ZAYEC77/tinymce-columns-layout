/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function () {
    function getParentRow(node) {
        var el = jQuery(node);
        if (el.is('.cms-row')) {
            return el;
        }
        return el.parents('.cms-row');
    }

    function getParentColumn(node) {
        var el = jQuery(node);
        if (el.is('[class^="cms-col-"]')) {
            return el;
        }
        return el.parents('[class^="cms-col-"]');
    }

    function getLastParent(node) {
        var el = jQuery(node);
        var parents = el.parents();
        if (parents.length > 0) {
            if (parents[0].nodeName === 'BODY') {
                return el;
            }
            for (var i = 1; i < parents.length; i++) {
                if (parents[i].nodeName === 'BODY') {
                    return parents[i - 1];
                }
            }
        }
        return el;
    }

    function getNewRowHtml(columnNumber, columnWidth, color) {
        var parts = [];
        parts.push('<div class="cms-row cms-row-' + color + '">');
        for (var i = 0; i < columnNumber; i++) {
            parts.push(getNewColumnHtml(columnWidth, i + 1));
        }
        parts.push('</div>');
        return parts.join('');
    }

    function getNewColumnHtml(columnWidth, index) {
        index = index || 1;
        var parts = [];
        parts.push('<div class="cms-col-' + columnWidth + '">');
        parts.push('<h2>' + index + '</h2>');
        parts.push('<h4>Title Goes Here</h4>');
        parts.push('<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cumsociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>');
        parts.push('</div>');
        return parts.join('');
    }

    function getClassValue(el, prefix) {
        var prefixLength = prefix.length;
        var classList = el.attr('class').split(' ');

        for (var i = 0; i < classList.length; i++) {
            var item = classList[i];
            if (item.indexOf(prefix) === 0 && (item.length > prefixLength)) {
                return item.substr(prefixLength);
            }
        }
        return 'white';
    }

    function setClassValue(el, oldValue, newValue, prefix) {
        var oldColorClass = prefix + oldValue;
        var newColorClass = prefix + newValue;
        el.attr('class', function (index, list) {
            return list.replace(oldColorClass, newColorClass);
        });
    }

    function getRowColor(row) {
        return getClassValue(row, 'cms-row-') || 'white';
    }

    function replaceRowColor(row, newColor) {
        setClassValue(row, getRowColor(row), newColor, 'cms-row-');
    }

    function getColumnWidth(column) {
        return getClassValue(column, 'cms-col-') || '1';
    }

    function replaceColumnWidth(column, newWidth) {
        setClassValue(column, getColumnWidth(column), newWidth, 'cms-col-');
    }

    tinymce.create('tinymce.plugins.ColumnsPlugin', {
        init: function (ed, url) {
            // Custom css
            ed.contentCSS.push(url + "/css/styles.css");


            // Register buttons
            ed.addButton('columns.InsertRowBefore', {
                title: 'Insert row',
                cmd: 'mceColumnsOpenInsertPopup',
                image: url + '/img/insert_icon.gif'
            });

            ed.addCommand('mceColumnsOpenInsertPopup', function () {
                ed.windowManager.open({
                    file: url + '/insert_dlg.htm',
                    width: 480 + parseInt(ed.getLang('columns.delta_width', 0)),
                    height: 385 + parseInt(ed.getLang('columns.delta_height', 0)),
                    inline: 1
                }, {
                    plugin_url: url
                });
            });

            ed.addCommand('mceColumnsInsertRow', function (ui, args) {
                var node = ed.selection.getNode();
                var parent = getLastParent(node);
                var newRow = jQuery(getNewRowHtml(args.columnNumber, args.columnWidth, args.color));

                if (args.position === 'before') {
                    newRow.insertBefore(parent);
                } else {
                    newRow.insertAfter(parent);
                }
            });


            ed.addCommand('mceColumnsDeleteRow', function () {
                var node = ed.selection.getNode();
                var row = getParentRow(node);
                row.remove();
            });

            ed.addCommand('mceColumnsDeleteColumn', function () {
                var node = ed.selection.getNode();
                var col = getParentColumn(node);
                col.remove();
            });


            ed.addCommand('mceColumnsInsertColumn', function (ui, columnWidth) {
                var node = ed.selection.getNode();
                var row = getParentRow(node);
                var lastCol = row.children().last();
                jQuery(getNewColumnHtml(columnWidth)).insertAfter(lastCol);
            });


            ed.addCommand('mceColumnsOpenEditPopup', function () {
                var node = ed.selection.getNode();

                var row = getParentRow(node);
                var column = getParentColumn(node);
                ed.mceColumns = {
                    row: row,
                    color: getRowColor(row),
                    column: column,
                    columnWidth: getColumnWidth(column)
                };

                ed.windowManager.open({
                    file: url + '/edit_dlg.htm',
                    width: 480 + parseInt(ed.getLang('columns.delta_width', 0)),
                    height: 385 + parseInt(ed.getLang('columns.delta_height', 0)),
                    inline: 1
                }, {
                    plugin_url: url,
                    node: node
                });
            });


            ed.addCommand('mceColumnsSaveRow', function (ui, args) {
                var node = ed.selection.getNode();
                var row = getParentRow(node);
                replaceRowColor(row, args.color);
            });

            ed.addCommand('mceColumnsSaveColumn', function (ui, args) {
                var node = ed.selection.getNode();
                var column = getParentColumn(node);
                replaceColumnWidth(column, args.width);
            });


            if (ed && ed.plugins.contextmenu) {
                ed.plugins.contextmenu.onContextMenu.add(function (th, m, e) {
                    var se = ed.selection;
                    var node = se.getNode();

                    var col = getParentColumn(node);

                    var row = getParentRow(node);
                    if (row.length) {
                        m.addSeparator();

                        m.add({title: 'Delete Row', icon: 'trash', cmd: 'mceColumnsDeleteRow'});

                        if (col.length) {
                            m.add({title: 'Delete Column', icon: 'trash', cmd: 'mceColumnsDeleteColumn'});
                        }

                        m.add({title: 'Edit row/columns', icon: 'grid', cmd: 'mceColumnsOpenEditPopup'});

                        m.addSeparator();
                    }
                });
            }
        },

        getInfo: function () {
            return {
                longname: 'Column layout',
                author: 'Dmytro Karpovych',
                authorurl: '',
                infourl: '',
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('columns', tinymce.plugins.ColumnsPlugin, ['contextmenu']);
})();