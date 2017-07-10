tinyMCEPopup.requireLangPack();

var EditRowDialog = {
    init: function (ed) {
        var node = ed.selection.getNode();
        if (node && ed.mceColumns) {
            document.forms[0].color.value = ed.mceColumns.color;
            document.forms[0].columnWidth.value = ed.mceColumns.columnWidth;
        }
    },

    insertColumn: function () {
        var newColumnWidth = document.forms[0].newColumnWidth.value;
        tinyMCEPopup.editor.execCommand('mceColumnsInsertColumn', false, newColumnWidth);
    },
    saveRow: function () {
        var args = {
            color: document.forms[0].color.value
        };
        tinyMCEPopup.editor.execCommand('mceColumnsSaveRow', false, args);
        tinyMCEPopup.close();
    },
    saveColumn: function () {
        var args = {
            width: document.forms[0].columnWidth.value
        };
        tinyMCEPopup.editor.execCommand('mceColumnsSaveColumn', false, args);
        tinyMCEPopup.close();
    },
    deleteRow: function () {
        tinyMCEPopup.editor.execCommand('mceColumnsDeleteRow', false);
        tinyMCEPopup.close();
    }
};

tinyMCEPopup.onInit.add(EditRowDialog.init, EditRowDialog);
