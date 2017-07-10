tinyMCEPopup.requireLangPack();

var InsertRowDialog = {
    init: function () {
    },

    insert: function () {
        var args = {
            columnNumber: parseInt(document.forms[0].columnNumber.value),
            columnWidth: parseInt(document.forms[0].columnWidth.value),
            color: document.forms[0].color.value,
            position: document.forms[0].position.value
        };
        debugger;
        tinyMCEPopup.editor.execCommand('mceColumnsInsertRow', false, args);
        tinyMCEPopup.close();
    }
};

tinyMCEPopup.onInit.add(InsertRowDialog.init, InsertRowDialog);
