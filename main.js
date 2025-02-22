//開発支援プログラムのメイン部分
let compileButton = document.getElementById('compile');

//現在読み込んでいる文字を保存する
let token="";

//index.htmlのmessageタグを取得
const message = document.getElementById('message');

//トークン番号を格納する配列
//↓構成内容
//tokenNum:トークン番号
//tokenValue:トークンの内容
//row:行数
let tokenNums = [];
//構文解析の際に使用する添字
let index=0;

//JavaのコードをJavaScriptに変換する際に使用する変数
let JavaScriptCode="";

//idがmeraidのタブを取得
let mermaid_element = document.getElementById('mermaid_id');

//ステップ実行をするための関数
let mainFunction;

//ラインを引くための変数
let marker;

//実行ボタンが押されたときの処理
compileButton.addEventListener('click', function () {

    JavaScriptCode="";

    //初期化
    //現在読み込んでいる文字を保存する
    token="";

    //トークン番号を格納する配列
    tokenNums = [];
    //構文解析の際に使用する添字
    index=0;

    //入力されたプログラムを取得
    let code = editor.getSession().getValue();

    //取得したプログラムをコンソールに出力
    console.log("==入力されたプログラム==");
    console.log(code);
    console.log("====================================");

    //字句解析を行う
    ziku(code);

    //トークンをコンソールに出力
    console.log("==トークン==");
    console.log(tokenNums);
    console.log("====================================");

    try {
        // 構文解析を行う(返り値はクラス名)
        const className=syntaxAnalysis();
    
        // エラーが発生しなかった場合はmessageに"コンパイル完了"を出力
        message.value += "コンパイル完了\n\n";
    
        // evalの代わりにFunctionコンストラクタを使用
        //JavaScriptCodeに変換したコードを格納(クラス名を返り値として返す)
        let func = new Function(JavaScriptCode + "return "+className+";");

        // クラスを取得
        const ClassFunc=func();

        // クラスのmainメソッドの情報を取得
        mainFunction=ClassFunc.main();
    
        // 変数を表で表示
        const table = document.getElementById('variable_table');
        let tr = "<tr><th>型</th><th>変数名</th><th>値</th><th>スコープ</th></tr>";
    
        for (let i = 0; i < variables.length; i++) {
            tr += "<tr><td>" + variables[i].Type + "</td><td>" + variables[i].Name + "</td><td>"+variables[i].Value+"</td><td>"+variables[i].Scope+"</td></tr>";
        }
    
        table.innerHTML = tr;


    
    } catch (e) {
        // エラーが発生した場合はエラーメッセージをmessageに出力
        message.value += e.message + "\n";
    }
    //JavaScriptCodeをコンソールに出力
    console.log("==JavaScriptCode==");
    console.log(JavaScriptCode);
    console.log("====================================");
    

});


//ステップ実行のボタンが押されたときの処理
let stepButton = document.getElementById('step');

stepButton.addEventListener('click', function () {
    // ジェネレータ関数の実行
    if(mainFunction.next().done){
        message.value += "プログラムが終了しました。\n";
        //マーカーを削除
        editor.getSession().removeMarker(marker);
        return;
    }

    //表やマーカーを更新
    update();
});