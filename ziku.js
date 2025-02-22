//字句解析をする関数
//引数：コード
//返り値：なし
//処理内容：コードを1文字ずつ読み込み、トークンを作成する
//トークンの内容はtokenNumsに格納
function ziku(code){

	//コードの列を格納する変数
    let row=1;

    //.を読み込んだ際にtokenに保存している文字列が数字だけかどうかを判定するための変数
    let isNumber=true;

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

    //トークンの一覧から'\r'を削除
    for(let i=0;i<tokenNums.length;i++){
        if(tokenNums[i].tokenValue=='\r'){
            tokenNums.splice(i,1);
            i--;
        }
    }
}

//文字の仕切りとなる文字かどうかを判定する関数
//引数：文字
//返り値：true(仕切り文字) false(仕切り文字でない)
function isDelimiter(str){
    if(str=='\n' || str==' '  || str=="(" || str==")" || str=="{" || str=="}" || str=="[" || str=="]" || str=="<" || str==">" || str=="," || str=="." || str=="|" || str=="&" || str=="'" || str=="\"" || str==";" || str=="=" || str=="+" || str=="-" || str=="*" || str=="/" || str=="%" || str=='\''|| str=='\t'){
        return true;
    }else{
        return false;
    }
}

//トークンを識別する関数
//引数：トークン
//返り値：トークン番号
//処理内容：トークンごとに番号を割り振る
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
    }else if(tmp_token=="this"){
        tokenNum=42;
    }else if(tmp_token=="super"){
        tokenNum=43;
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
