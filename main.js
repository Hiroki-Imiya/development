//開発支援プログラムのメイン部分

let runButton = document.getElementById('run');

//現在読み込んでいる文字を保存する
let token="";

//トークン番号を格納する配列
let tokenNums = [];
//構文解析の際に使用する添字
let index=0;

//実行ボタンが押されたときの処理
runButton.addEventListener('click', function () {

    //.を読み込んだ際にtokenに保存している文字列が数字だけかどうかを判定するための変数
    let isNumber=true;

    //入力されたプログラムを取得
    let code = editor.getSession().getValue();

    console.log(code);

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
                tokenNums.push(37);
                console.log(37+" "+token);
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
                        tokenNums.push(tmp);
                        token=""
                    }
                }else{
                    //トークンの型を出力
                    let tmp=identifyToken(token);
                    tokenNums.push(tmp);
                    token=""
                }
            }
            //改行または空白またはタブの場合はスキップ
            if(str=="\n" || str==" " || str=="\t"){
                continue;
            }else{
                //トークンを識別
                tmp=identifyToken(str);
                tokenNums.push(tmp);
            }
        }else{
            //トークンを作成
            token+=str;
        }
    }

    console.log(tokenNums);

    try{
        //構文解析を行う
        syntaxAnalysis();
    }catch(e){
        console.log(e.message);
    }


});

//文字の仕切りとなる文字かどうかを判定する関数
function isDelimiter(str){
    if(str=="\n" || str==" " || str=="(" || str==")" || str=="{" || str=="}" || str=="[" || str=="]" || str=="<" || str==">" || str=="," || str=="." || str=="|" || str=="&" || str=="'" || str=="\"" || str==";" || str=="=" || str=="+" || str=="-" || str=="*" || str=="/" || str=="%"){
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
        //整数の場合
        if(Number.isInteger(tmp_token)){
            tokenNum=35;
        }else{
            //実数の場合
            tokenNum=36;
        }
    }else {
        tokenNum=1;
    }

    console.log(tokenNum+" "+tmp_token);

    return tokenNum;
}

//構文解析を行う関数
function syntaxAnalysis(){
    //トークンの数だけ繰り返す
    for(index=0;index<tokenNums.length;index++){
        //プログラムの関数
        program();
    }
}

//プログラムの関数
function program(){
    //トークンによって処理を分岐
    switch (tokenNums[index]){
        //importの場合
        case 5:
            index++;
            importStatement();
            break;
        //アクセス修飾子の場合
        case 14:
        case 15:
            index++;
            //クラス定義の関数
            classDefinition();
            break;

        default:
            throw new Error("プログラムエラー");
            break;
    }
}

//import文の関数
function importStatement(){
    //識別子でなければエラー
    if(tokenNums[index]!=1){
        throw new Error("importの後に識別子がありません");
    }
    index++;

    //トークンが.の間繰り返す
    while(tokenNums[index]==64){
        index++;
        //識別子でなければエラー
        if(tokenNums[index]!=1){
            throw new Error(".の後に識別子がありません");
        }
        index++;
    }

    //;でなければエラー
    if(tokenNums[index]!=69){
        throw new Error("import文が;で終わっていません");
    }
    index++;

}

//クラス定義の関数
function classDefinition(){
    //クラスでなければエラー
    if(tokenNums[index]!=6){
        throw new Error("classがありません");
    }
    index++;

    //クラス名でなければエラー
    if(tokenNums[index]!=1){
        throw new Error("クラス名がありません");
    }
    index++;

    //{でなければエラー
    if(tokenNums[index]!=57){
        throw new Error("{がありません");
    }

    index++;

    //ファースト集合である間繰り返す
    while (false){
        break;
    }

    //}でなければエラー
    if(tokenNums[index]!=58){
        throw new Error("}で終わっていません");
    }
    index++;
}

