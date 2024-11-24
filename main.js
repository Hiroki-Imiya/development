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

    //コードの列を格納する変数
    let row=1;

    //.を読み込んだ際にtokenに保存している文字列が数字だけかどうかを判定するための変数
    let isNumber=true;

    //入力されたプログラムを取得
    let code = editor.getSession().getValue();

    //取得したプログラムをコンソールに出力
    console.log("==入力されたプログラム==");
    console.log(code);
    console.log("====================================");

    //codeの内容を字句解析する
    for (let i = 0; i < code.length; i++) {
        //文字を1文字ずつ取り出す
        let str=code.charAt(i);

        //しきりとなる文字かどうかを判定
        if(isDelimiter(str)){

            //文字列の場合
            if(str=="\""){
                i++;
                //次の"が見つかるまでtokenに追加
                while(code.charAt(i)!="\""){
                    token+=code.charAt(i);
                    i++;
                }
                //文字列のトークン番号である37
                let tmp_tokens={
                    tokenNum:37,
                    tokenValue:token,
                    row:row
                }
                tokenNums.push(tmp_tokens);
                token="";
                continue;
            }

            //文字の場合
            if(str=="'"){
                i++;
                //次の'が見つかるまでtokenに追加
                while(code.charAt(i)!="'"){
                    token+=code.charAt(i);
                    i++;
                }
                //文字のトークン番号である41
                let tmp_tokens={
                    tokenNum:41,
                    tokenValue:token,
                    row:row
                }
                tokenNums.push(tmp_tokens);
                token="";
                continue;
            }

            //tokenに内容がある場合はトークンを識別してtokenNumsに格納
            if(token!=""){
                if(str=="." ){       //今の読み込んでいる文字がコンマの場合
                    //tokenの内容が数字だけかどうかを判定
                    for(let j=0;j<token.length;j++){
                        if(isNaN(token.charAt(j))){
                            isNumber=false;
                            break;
                        }
                    }
                    //tokenの内容が数字だけの場合
                    if(isNumber){
                        token+=str;
                        continue;
                    }else{
                        //トークンの型を出力
                        let tmp=identifyToken(token);
                        let tmp_tokens={
                            tokenNum:tmp,
                            tokenValue:token,
                            row:row
                        }
                        tokenNums.push(tmp_tokens);
                        token=""
                        isNumber=true;
                    }
                }else{
                    //トークンの型を出力
                    let tmp=identifyToken(token);
                    let tmp_tokens={
                        tokenNum:tmp,
                        tokenValue:token,
                        row:row
                    }
                    tokenNums.push(tmp_tokens);
                    token=""
                }
            }
            //改行または空白またはタブの場合はスキップ
            if(str=='\n' || str==' ' || str=='\t'){
                //改行の場合は行数をカウント
                if(str=='\n'){
                    row++;
                }
                continue;
            }else{
                //トークンを識別
                tmp=identifyToken(str);
                let tmp_tokens={
                    tokenNum:tmp,
                    tokenValue:str,
                    row:row
                }
                tokenNums.push(tmp_tokens);
            }
        }else{
            //トークンを作成
            token+=str;
        }
    }

    //トークンをコンソールに出力
    console.log("==トークン==");
    console.log(tokenNums);
    console.log("====================================");

    try {
        // 構文解析を行う(返り値はクラス名)
        const className=syntaxAnalysis();
    
        // エラーが発生しなかった場合はmessageに"正常終了"を出力
        message.value += "正常終了\n\n";
    
        // evalの代わりにFunctionコンストラクタを使用
        //JavaScriptCodeに変換したコードを格納(クラス名を返り値として返す)
        let func = new Function(JavaScriptCode + "return "+className+";");

        // クラスを取得
        const ClassFunc=func();

        // クラスのmainメソッドの情報を取得
        mainFunction=ClassFunc.main();
    
        // 変数を表で表示
        const table = document.getElementById('right');
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

//文字の仕切りとなる文字かどうかを判定する関数
function isDelimiter(str){
    if(str=='\n' || str==' '  || str=="(" || str==")" || str=="{" || str=="}" || str=="[" || str=="]" || str=="<" || str==">" || str=="," || str=="." || str=="|" || str=="&" || str=="'" || str=="\"" || str==";" || str=="=" || str=="+" || str=="-" || str=="*" || str=="/" || str=="%" || str=='\''|| str=='\t'){
        return true;
    }else{
        return false;
    }
}

//トークンを識別する関数
function identifyToken(tmp_token){
    let tokenNum;

    //トークンごとに番号を割り振る
    if(tmp_token=="print"){
        tokenNum=2;
    }else if(tmp_token=="println"){
        tokenNum=3;
    }else if(tmp_token=="printf"){
        tokenNum=4;
    }else if(tmp_token=="import"){
        tokenNum=5;
    }else if(tmp_token=="class"){
        tokenNum=6;
    }else if(tmp_token=="if"){
        tokenNum=7;
    }else if(tmp_token=="else"){
        tokenNum=8;
    }else if(tmp_token=="while"){
        tokenNum=9;
    }else if(tmp_token=="for"){
        tokenNum=10;
    }else if(tmp_token=="return"){
        tokenNum=11;
    }else if(tmp_token=="break"){
        tokenNum=12;
    }else if(tmp_token=="new"){
        tokenNum=13;
    }else if(tmp_token=="public"){
        tokenNum=14;
    }else if(tmp_token=="private"){
        tokenNum=15;
    }else if(tmp_token=="static"){
        tokenNum=17;
    }else if(tmp_token=="extends"){
        tokenNum=22;
    }else if(tmp_token=="int"){
        tokenNum=25;
    }else if(tmp_token=="byte"){
        tokenNum=26;
    }else if(tmp_token=="short"){
        tokenNum=27;
    }else if(tmp_token=="long"){
        tokenNum=28;
    }else if(tmp_token=="float"){
        tokenNum=29;
    }else if(tmp_token=="double"){
        tokenNum=30;
    }else if(tmp_token=="boolean"){
        tokenNum=31;
    }else if(tmp_token=="char"){
        tokenNum=32;
    }else if(tmp_token=="String"){
        tokenNum=33;
    }else if(tmp_token=="ArrayList"){
        tokenNum=34;
    }else if(tmp_token=="true"){
        tokenNum=38;
    }else if(tmp_token=="false"){
        tokenNum=39;
    }else if(tmp_token=="void"){
        tokenNum=40;
    }else if(tmp_token=="+"){
        tokenNum=50;
    }else if(tmp_token=="-"){
        tokenNum=51;
    }else if(tmp_token=="*"){
        tokenNum=52;
    }else if(tmp_token=="/"){
        tokenNum=53;
    }else if(tmp_token=="%"){
        tokenNum=54;
    }else if(tmp_token=="("){
        tokenNum=55;
    }else if(tmp_token==")"){
        tokenNum=56;
    }else if(tmp_token=="{"){
        tokenNum=57;
    }else if(tmp_token=="}"){
        tokenNum=58;
    }else if(tmp_token=="["){
        tokenNum=59;
    }else if(tmp_token=="]"){
        tokenNum=60;
    }else if(tmp_token=="<"){
        tokenNum=61;
    }else if(tmp_token==">"){
        tokenNum=62;
    }else if(tmp_token==","){
        tokenNum=63;
    }else if(tmp_token=="."){
        tokenNum=64;
    }else if(tmp_token=="|"){
        tokenNum=65;
    }else if(tmp_token=="&"){
        tokenNum=66;
    }else if(tmp_token=="'"){
        tokenNum=67;
    }else if(tmp_token=="\""){
        tokenNum=68;
    }else if(tmp_token==";"){
        tokenNum=69;
    }else if(tmp_token=="="){
        tokenNum=70;
    }else if(!isNaN(tmp_token)){

        //tmp_tokenを一文字ずつ取り出して整数か実数かを判定
        let isFloat=false;
        for(let i=0;i<tmp_token.length;i++){
            if(tmp_token.charAt(i)=="."){
                isFloat=true;
                break;
            }
        }

        if(isFloat){
            tokenNum=36;
        }else{
            tokenNum=35;
        }

    }else {
        tokenNum=1;
    }

    return tokenNum;
}

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

    update();
});

//ジェネレーター関数でマーカーや表を更新する関数
function update(){
    //マーカーの更新
    changeColor(currentRow);

    // 変数を表で表示
    const table = document.getElementById('right');
    let tr = "<tr><th>型</th><th>変数名</th><th>値</th><th>スコープ</th></tr>";

    for (let i = 0; i < variables.length; i++) {
        tr += "<tr><td>" + variables[i].Type + "</td><td>" + variables[i].Name + "</td><td>"+variables[i].Value+"</td><td>"+variables[i].Scope+"</td></tr>";
    }


    table.innerHTML = tr;
}
