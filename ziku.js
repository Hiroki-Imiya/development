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

//区切り文字のセット
const DELIMITER_SET = new Set([
    '\n', ' ', '\t', '(', ')', '{', '}', '[', ']', 
    '<', '>', ',', '.', '|', '&', "'", '"', ';', 
    '=', '+', '-', '*', '/', '%'
]);

//文字の仕切りとなる文字かどうかを判定する関数
//引数：文字
//返り値：true(仕切り文字) false(仕切り文字でない)
function isDelimiter(str){
    return DELIMITER_SET.has(str);
}

//トークンマップ：トークン文字列とトークン番号の対応表
const TOKEN_MAP = {
    "print": 2,
    "println": 3,
    "printf": 4,
    "import": 5,
    "class": 6,
    "if": 7,
    "else": 8,
    "while": 9,
    "for": 10,
    "return": 11,
    "break": 12,
    "new": 13,
    "public": 14,
    "private": 15,
    "static": 17,
    "extends": 22,
    "int": 25,
    "byte": 26,
    "short": 27,
    "long": 28,
    "float": 29,
    "double": 30,
    "boolean": 31,
    "char": 32,
    "String": 33,
    "ArrayList": 34,
    "true": 38,
    "false": 39,
    "void": 40,
    "this": 42,
    "super": 43,
    "+": 50,
    "-": 51,
    "*": 52,
    "/": 53,
    "%": 54,
    "(": 55,
    ")": 56,
    "{": 57,
    "}": 58,
    "[": 59,
    "]": 60,
    "<": 61,
    ">": 62,
    ",": 63,
    ".": 64,
    "|": 65,
    "&": 66,
    "'": 67,
    "\"": 68,
    ";": 69,
    "=": 70
};

//トークンを識別する関数
//引数：トークン
//返り値：トークン番号
//処理内容：トークンごとに番号を割り振る
function identifyToken(tmp_token){
    //トークンマップに存在する場合はその番号を返す
    if(tmp_token in TOKEN_MAP){
        return TOKEN_MAP[tmp_token];
    }
    
    //数値の判定
    if(!isNaN(tmp_token)){
        //tmp_tokenを一文字ずつ取り出して整数か実数かを判定
        let isFloat=false;
        for(let i=0;i<tmp_token.length;i++){
            if(tmp_token.charAt(i)=="."){
                isFloat=true;
                break;
            }
        }

        return isFloat ? 36 : 35;
    }
    
    //識別子として扱う
    return 1;
}
