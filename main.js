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

    //入力されたプログラムを取得
    let code = editor.getSession().getValue();

    console.log(code);

    //codeの内容を字句解析する
    for (let i = 0; i < code.length; i++) {
        //文字を1文字ずつ取り出す
        let str=code.charAt(i);

        //しきりとなる文字かどうかを判定
        if(isDelimiter(str)){
            //tokenに内容がある場合はトークンを識別してtokenNumsに格納
            if(token!=""){
                //文字列の場合
                if(str=="\""){
                    token+=str;
                    i++;
                    //次の"が見つかるまでtokenに追加
                    while(code.charAt(i)!="\""){
                        token+=code.charAt(i);
                        i++;
                    }
                    //文字列のトークン番号である37
                    tokenNums.push(37);
                    token="";
                }else if(str=="." && Number()!=NaN){       //今の読み込んでいる文字がコンマで、tokenが数字の場合(実数の場合)
                    token+=str;
                }else{
                    let tmp=identifyToken(token);
                    tokenNums.push(tmp);
                    token=""
                }
            }
            //改行または空白の場合はスキップ
            if(str=="\n" || str==" "){
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
    if(str=="\n" || str==" " || str=="." || str=="(" || str==")" || str=="{" || str=="}" || str=="[" || str=="]" || str=="<" || str==">" || str=="," || str=="." || str=="|" || str=="&" || str=="'" || str=="\"" || str==";" || str=="=" || str=="+" || str=="-" || str=="*" || str=="/" || str=="%"){
        return true;
    }else{
        return false;
    }
}

//トークンを識別する関数
function identifyToken(token){
    let tokenNum;

    //トークンごとに番号を割り振る
    if(token=="print"){
        tokenNum=2;
    }else if(token=="println"){
        tokenNum=3;
    }else if(token=="printf"){
        tokenNum=4;
    }else if(token=="import"){
        tokenNum=5;
    }else if(token=="class"){
        tokenNum=6;
    }else if(token=="if"){
        tokenNum=7;
    }else if(token=="else"){
        tokenNum=8;
    }else if(token=="while"){
        tokenNum=9;
    }else if(token=="for"){
        tokenNum=10;
    }else if(token=="return"){
        tokenNum=11;
    }else if(token=="break"){
        tokenNum=12;
    }else if(token=="new"){
        tokenNum=13;
    }else if(token=="public"){
        tokenNum=14;
    }else if(token=="private"){
        tokenNum=15;
    }else if(token=="static"){
        tokenNum=17;
    }else if(token=="int"){
        tokenNum=25;
    }else if(token=="byte"){
        tokenNum=26;
    }else if(token=="short"){
        tokenNum=27;
    }else if(token=="long"){
        tokenNum=28;
    }else if(token=="float"){
        tokenNum=29;
    }else if(token=="double"){
        tokenNum=30;
    }else if(token=="boolean"){
        tokenNum=31;
    }else if(token=="char"){
        tokenNum=32;
    }else if(token=="String"){
        tokenNum=33;
    }else if(token=="ArrayList"){
        tokenNum=34;
    }else if(token=="true"){
        tokenNum=38;
    }else if(token=="false"){
        tokenNum=39;
    }else if(token=="void"){
        tokenNum=40;
    }else if(token=="+"){
        tokenNum=50;
    }else if(token=="-"){
        tokenNum=51;
    }else if(token=="*"){
        tokenNum=52;
    }else if(token=="/"){
        tokenNum=53;
    }else if(token=="%"){
        tokenNum=54;
    }else if(token=="("){
        tokenNum=55;
    }else if(token==")"){
        tokenNum=56;
    }else if(token=="{"){
        tokenNum=57;
    }else if(token=="}"){
        tokenNum=58;
    }else if(token=="["){
        tokenNum=59;
    }else if(token=="]"){
        tokenNum=60;
    }else if(token=="<"){
        tokenNum=61;
    }else if(token==">"){
        tokenNum=62;
    }else if(token==","){
        tokenNum=63;
    }else if(token=="."){
        tokenNum=64;
    }else if(token=="|"){
        tokenNum=65;
    }else if(token=="&"){
        tokenNum=66;
    }else if(token=="'"){
        tokenNum=67;
    }else if(token=="\""){
        tokenNum=68;
    }else if(token==";"){
        tokenNum=69;
    }else if(token=="="){
        tokenNum=70;
    }else if(Number(token)!=NaN){
        let tmp=Number(token);
        //整数の場合
        if(Number.isInteger(tmp)){
            tokenNum=35;
        }else{
            //実数の場合
            tokenNum=36;
        }
    }else {
        tokenNum=1;
    }

    console.log(tokenNum+" "+token);

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
    while (tokenNums[index]){

    }

    //}でなければエラー
    if(tokenNums[index]!=58){
        throw new Error("}で終わっていません");
    }
    index++;
}

