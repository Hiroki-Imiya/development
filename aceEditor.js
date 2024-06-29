let editor;

editorInit();

function editorInit() {
    editor = ace.edit("editor");

    //テーマの設定
    editor.setTheme("ace/theme/monokai");
    //フォントサイズの設定
    editor.setFontSize(14);
    //Java言語の指定
    editor.getSession().setMode("ace/mode/java");
    //自動改行
    editor.getSession().setUseWrapMode(true);
    //タブサイズ
    editor.getSession().setTabSize(4);
    // 警告メッセージを無効にする
    editor.$blockScrolling = Infinity;
}