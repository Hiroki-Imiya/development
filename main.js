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

    //初期化
    //現在読み込んでいる文字を保存する
    token="";

    //トークン番号を格納する配列
    tokenNums = [];
    //構文解析の際に使用する添字
    index=0;

    //index.htmlのstdlinタグを取得
    const stdlin = document.getElementById('stdlin');

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
                let tmp_tokens={
                    tokenNum:37,
                    tokenValue:token
                }
                tokenNums.push(tmp_tokens);
                console.log(37+" "+tokenNums);
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
                    tokenValue:token
                }
                tokenNums.push(tmp_tokens);
                console.log(41+" "+token);
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
                            tokenValue:token
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
                        tokenValue:token
                    }
                    tokenNums.push(tmp_tokens);
                    token=""
                }
            }
            //改行または空白またはタブの場合はスキップ
            if(str=="\n" || str==" " || str=="\t"){
                continue;
            }else{
                //トークンを識別
                tmp=identifyToken(str);
                let tmp_tokens={
                    tokenNum:tmp,
                    tokenValue:str
                }
                tokenNums.push(tmp_tokens);
            }
        }else{
            //トークンを作成
            token+=str;
        }
    }

    //idがrigitに表形式で表示
    const table = document.getElementById('right');
    let tr="<tr><th>トークン番号</th><th>トークン</th></tr>";

    for(let i=0;i<tokenNums.length;i++){

        tr+="<tr><td>"+tokenNums[i].tokenNum+"</td><td>"+tokenNums[i].tokenValue+"</td></tr>";
    }

    table.innerHTML=tr;

    try{
        //構文解析を行う
        syntaxAnalysis();

        //エラーが発生しなかった場合はstdlinに"正常終了"を出力
        stdlin.innerHTML = "正常終了";

        console.log("正常終了");
    }catch(e){

        //エラーが発生した場合はエラーメッセージをstdlinに出力
        stdlin.innerHTML = e.message;
        console.log(e.message);
    }


});

//文字の仕切りとなる文字かどうかを判定する関数
function isDelimiter(str){
    if(str=="\n" || str==" " || str=="(" || str==")" || str=="{" || str=="}" || str=="[" || str=="]" || str=="<" || str==">" || str=="," || str=="." || str=="|" || str=="&" || str=="'" || str=="\"" || str==";" || str=="=" || str=="+" || str=="-" || str=="*" || str=="/" || str=="%" || str=='\''|| str=='\t'){
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

    console.log(tokenNum+" "+tmp_token);

    return tokenNum;
}