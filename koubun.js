/*入力されたプログラムの構文解析を行うJavaScript */

// トークン番号の定数定義
const TOKEN = {
    IDENTIFIER: 1,
    PRINT: 2,
    PRINTLN: 3,
    PRINTF: 4,
    IMPORT: 5,
    CLASS: 6,
    IF: 7,
    ELSE: 8,
    WHILE: 9,
    FOR: 10,
    RETURN: 11,
    BREAK: 12,
    NEW: 13,
    PUBLIC: 14,
    PRIVATE: 15,
    STATIC: 17,
    EXTENDS: 22,
    INT: 25,
    BYTE: 26,
    SHORT: 27,
    LONG: 28,
    FLOAT: 29,
    DOUBLE: 30,
    BOOLEAN: 31,
    CHAR: 32,
    STRING: 33,
    ARRAYLIST: 34,
    INTEGER: 35,
    REAL: 36,
    STRING_LITERAL: 37,
    TRUE: 38,
    FALSE: 39,
    VOID: 40,
    CHAR_LITERAL: 41,
    SUPER: 43,
    PLUS: 50,
    MINUS: 51,
    MULTIPLY: 52,
    DIVIDE: 53,
    MODULO: 54,
    LPAREN: 55,
    RPAREN: 56,
    LBRACE: 57,
    RBRACE: 58,
    LBRACKET: 59,
    RBRACKET: 60,
    LT: 61,
    GT: 62,
    COMMA: 63,
    DOT: 64,
    PIPE: 65,
    AMPERSAND: 66,
    SEMICOLON: 69,
    EQUALS: 70
};

//関数の引数かどうかのフラグ
let functionFlag = false;

//出てくる変数をスコープごとに分けて格納する配列
let variables = [];

//配列かどうかのフラグ
let arrayFlag = false;

//プログラムのスコープを示す変数
let scope ;

//いままで出てきたスコープの最大値
let maxScope = 0;

//呼び出し部分がfor文の場合のフラグ
let forFlag = false;

//ステップ実行の際に現在実行している行数を格納する変数
let currentRow = 0;

//呼び出し元がクラスのフィールド宣言かどうかのフラグ
let classFieldFlag = false;

//呼び出し元が返り値かどうかのフラグ
let returnFlag = false;

//フィールド値やメソッドpublicかどうかのフラグ
//publicの場合はtrue
//privateの場合はfalse
let publicFlag = false;

//フィールド値やメソッドが静的かどうかのフラグ
//静的の場合はtrue
//静的でない場合はfalse
let staticFlag = false;

//フィールド値の識別子を格納する配列
//所属しているクラス名:className
//名前:filedName
//型:type
//アクセス修飾子:access
//静的かどうか:static
let fieldIdentifiers = [];

//フィールド宣言の変数表への文を一時的に格納する変数
let fieldDeclarationCode = "";

//登場したクラス名を格納する配列
//クラス名:className
//main関数を持つかどうか:mainFlag
let classes = [];

//クラスの添字
let classIndex = 0;

//登場したメソッド名を保存する配列
//所属しているクラス名:className
//メソッド名:methodName
//アクセス修飾子:publicFlag
//静的かどうか:staticFlag
//引数の名前:argumentName[]
//返り値の型:returnType
let method = [];

//クラスの親と子の関係を示す配列
//親クラス名:parent
//子クラス名:child
let classRelation = [];

//クラスのインスタンスを示す配列
//持っているクラス名:className
//インスタンス化されているクラス名:relation
let mutualRelation = [];

// ヘルパー関数: トークン番号が型かどうかをチェック
function isTypeToken(tokenNum) {
    return tokenNum === TOKEN.INT || tokenNum === TOKEN.BYTE || 
           tokenNum === TOKEN.SHORT || tokenNum === TOKEN.LONG || 
           tokenNum === TOKEN.FLOAT || tokenNum === TOKEN.DOUBLE || 
           tokenNum === TOKEN.BOOLEAN || tokenNum === TOKEN.CHAR || 
           tokenNum === TOKEN.STRING || tokenNum === TOKEN.ARRAYLIST;
}

// ヘルパー関数: トークン番号が演算子かどうかをチェック
function isOperatorToken(tokenNum) {
    return tokenNum === TOKEN.PLUS || tokenNum === TOKEN.MINUS || 
           tokenNum === TOKEN.MULTIPLY || tokenNum === TOKEN.DIVIDE || 
           tokenNum === TOKEN.MODULO;
}

// ヘルパー関数: 型番号を文字列に変換
function typeTokenToString(tokenNum) {
    const typeMap = {
        [TOKEN.INT]: 'int',
        [TOKEN.BYTE]: 'byte',
        [TOKEN.SHORT]: 'short',
        [TOKEN.LONG]: 'long',
        [TOKEN.FLOAT]: 'float',
        [TOKEN.DOUBLE]: 'double',
        [TOKEN.BOOLEAN]: 'boolean',
        [TOKEN.CHAR]: 'char',
        [TOKEN.STRING]: 'String'
    };
    return typeMap[tokenNum] || '';
}

// ヘルパー関数: 識別子がフィールドかどうかをチェックし、適切な形式で返す
function formatIdentifier(identifierName) {
    if (fieldIdentifiers.length === 0) {
        return identifierName;
    }
    
    for (let i = 0; i < fieldIdentifiers.length; i++) {
        if (fieldIdentifiers[i].fieldName === identifierName) {
            return "this." + identifierName;
        }
    }
    return identifierName;
}

// ヘルパー関数: 変数を変数表に追加するコードを生成して適切な場所に追加
// この関数は int, byte, double, char, string型のみを処理します
function addVariableToTable(variableName, variableType, isArray) {
    const typeStr = typeTokenToString(variableType);
    if (!typeStr) {
        // typeTokenToStringがサポートしていない型は処理しない
        return;
    }
    
    const arrayStr = isArray ? '[]' : '';
    let defaultValue;
    
    if (isArray) {
        defaultValue = '[]';
    } else if (variableType === TOKEN.INT || variableType === TOKEN.BYTE) {
        defaultValue = '0';
    } else if (variableType === TOKEN.DOUBLE) {
        defaultValue = '0.0';
    } else if (variableType === TOKEN.CHAR) {
        defaultValue = "'a'";
    } else if (variableType === TOKEN.STRING) {
        defaultValue = '""';
    } else {
        return; // その他の型は別処理
    }
    
    const code = `addVariable("${variableName}","${typeStr}${arrayStr}",${defaultValue},${scope});\n`;
    
    if (classFieldFlag) {
        fieldDeclarationCode += code;
    } else {
        JavaScriptCode += code;
    }
}

// ヘルパー関数: 変数オブジェクトを作成して配列に追加
// 変数の型、名前、初期値、スコープを受け取り、変数配列に追加する
function createAndPushVariable(variableName, typeString, defaultValue) {
    const variable = {
        Name: variableName,
        Type: typeString,
        Value: defaultValue,
        Scope: scope
    };
    variables.push(variable);
    return variable;
}

// ヘルパー関数: 整数型の初期化を処理する
// int, byte, short, long型の初期化処理を統一
function handleIntegerTypeInitialization(typeName, allowIdentifier = false) {
    // 整数または識別子(必要に応じて)でなければエラー
    if(allowIdentifier){
        if(tokenNums[index].tokenNum !== TOKEN.INTEGER && tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
            throw new Error(`${typeName}型に整数がありません.トークン名:${tokenNums[index].tokenNum} 配列の添字:${index}`);
        }
    } else {
        if(tokenNums[index].tokenNum !== TOKEN.INTEGER){
            throw new Error(`${typeName}型に整数がありません.トークン名:${tokenNums[index].tokenNum} 配列の添字:${index}`);
        }
    }
    
    // JavaScriptに整数を追加
    JavaScriptCode += tokenNums[index].tokenValue;
    index++;

    // 演算子である間繰り返す
    while(isOperatorToken(tokenNums[index].tokenNum)){
        // 演算子を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;

        // 整数または識別子でなければエラー
        if(allowIdentifier){
            if(tokenNums[index].tokenNum !== TOKEN.INTEGER && tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
                throw new Error(`${typeName}型に整数以外の計算をしようとしています.トークン名:${tokenNums[index].tokenNum} 配列の添字:${index}`);
            }
        } else {
            if(tokenNums[index].tokenNum !== TOKEN.INTEGER){
                throw new Error(`${typeName}型に整数以外の計算をしようとしています.トークン名:${tokenNums[index].tokenNum} 配列の添字:${index}`);
            }
        }
        
        // JavaScriptに整数を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }
}

// ヘルパー関数: スコープを増加させる
// スコープを1増やし、必要に応じて最大スコープも更新する
function incrementScope() {
    scope++;
    // 増やした後が最大値より小さい場合は最大値より大きくする
    if(scope <= maxScope){
        scope = maxScope + 1;
    }
    // 最大値を更新
    maxScope = scope;
}

// ヘルパー関数: 現在のスコープをクリーンアップするコードを追加
// スコープの変数を削除し、現在の行を保存し、yieldを追加
function addScopeCleanup() {
    JavaScriptCode += "deleteVariable(" + scope + ");\n";
    JavaScriptCode += "saveLine(" + tokenNums[index].row + ");\n";
    JavaScriptCode += "yield;\n";
}

//構文解析を行う関数
//引数：なし
//返り値：クラス名
function syntaxAnalysis(){

    //スコープを初期化
    scope = 0;
    maxScope = 0;

    //出てくる変数を格納する配列を初期化
    variables = [];

    //配列かどうかのフラグを初期化
    arrayFlag = false;

    //関数の引数かどうかのフラグを初期化
    functionFlag = false;

    //呼び出し部分がfor文の場合のフラグを初期化
    forFlag = false;

    //呼び出し元がクラスのフィールド宣言かどうかのフラグを初期化
    classFieldFlag = false;

    //フィールド値の識別子を格納する配列を初期化
    fieldIdentifiers = [];

    //フィールド宣言の変数表への文を一時的に格納する変数を初期化
    fieldDeclarationCode = "";

    //登場したクラス名を格納する配列を初期化
    classes = [];

    //クラスの添字を初期化
    classIndex = 0;

    //登場したメソッド名を格納する配列を初期化
    method = [];

    //クラスの親と子の関係を示す配列を初期化
    classRelation = [];

    //クラスの相互関係を示す配列を初期化
    mutualRelation = [];

    //JavaScriptのコードを格納する変数
    JavaScriptCode = "";

    //mainを含むクラス名を格納する変数
    let class_main;
    
    //トークンの数だけ繰り返す
    index=0;
    while(index<tokenNums.length){
        //プログラムの関数
        program();
        index++;
    }

    //静的でないフィールドを変数表に格納するためのクラスのインスタンスのコードを格納
    for(let i=0;i<classes.length;i++){
        JavaScriptCode += "let tmp_filed_claass"+i+" = new "+classes[i].className+"();\n";
    }

    //fieldDeclarationCodeにフィールド宣言のコードを格納
    JavaScriptCode += fieldDeclarationCode;

    //mermaidの内容を読み込む
    let classDiagram='classDiagram \n';

    //クラス図の作成(mermaid形式)
    if(classes.length==0){
        throw new Error("クラス名がありません");
    }else{
        for(let i=0;i<classes.length;i++){
            classDiagram += 'class '+classes[i].className + ' {\n';
            for(let j=0;j<fieldIdentifiers.length;j++){
                if(fieldIdentifiers[j].className==classes[i].className){
                    //アクセス修飾子がprivateであれば-をつける
                    if(!fieldIdentifiers[j].access){
                        classDiagram += '- ';
                    //publicであれば+をつける
                    }else{
                        classDiagram += '+ ';
                    }

                    //型を追加
                    const typeStr = typeTokenToString(fieldIdentifiers[j].type);
                    if (typeStr) {
                        classDiagram += typeStr + ' ';
                    } else if(fieldIdentifiers[j].type === TOKEN.IDENTIFIER){
                        classDiagram += fieldIdentifiers[j].type+' ';
                    }

                    classDiagram += fieldIdentifiers[j].fieldName ;

                    //静的であれば下線を引くために$をつける
                    if(fieldIdentifiers[j].static){
                        classDiagram += '$';
                    }
                    
                    classDiagram += '\n';
                }
            }
            for(let j=0;j<method.length;j++){
                //現在参照しているメソッドがクラスのメソッドであれば
                if(method[j].className==classes[i].className){
                    //アクセス修飾子がprivateであれば-をつける
                    if(!method[j].access){
                        classDiagram += '- ';
                    //publicであれば+をつける
                    }else{
                        classDiagram += '+ ';
                    }

                    classDiagram += method[j].methodName+'(';

                    //引数があれば追加
                    for(let k=0;k<method[j].argumentName.length;k++){
                        if(k!=0){
                            classDiagram += ',';
                        }
                        classDiagram += method[j].argumentName[k];
                    }

                    classDiagram += ')';

                    //返り値の型を追加
                    classDiagram += ' ';
                    const returnTypeStr = typeTokenToString(method[j].returnType);
                    if (returnTypeStr) {
                        classDiagram += returnTypeStr;
                    }

                    //静的であれば下線を引くために$をつける
                    if(method[j].static){
                        classDiagram += '$';
                    }

                    classDiagram += '\n';

                }
            }
            classDiagram += '}\n';
        }

        //クラスの親子関係を示す矢印を追加
        for(let i=0;i<classRelation.length;i++){
            classDiagram += classRelation[i].parent + ' <|-- ' + classRelation[i].child + '\n';
        }

        //クラスの相互関係を示す矢印を追加
        for(let i=0;i<mutualRelation.length;i++){
            classDiagram += mutualRelation[i].className + ' ..> ' + mutualRelation[i].relation + ':«instantiate»\n';
        }
    }

    console.log("==========Mermaid==========");
    console.log(classDiagram);
    console.log("===========================");

    //mermaidの再描画
    mermaid_element.removeAttribute('data-processed');
    mermaid_element.innerHTML = classDiagram;
    mermaid.init();

    //main関数のクラス名を取得
    for(let i=0;i<classes.length;i++){
        if(classes[i].mainFlag){
            class_main = classes[i].className;
        }
    }

    return class_main;

}

//プログラムの関数
//引数：クラス名
//返り値：なし
function program(){
    //トークンによって処理を分岐
    switch (tokenNums[index].tokenNum){
        //importの場合
        case TOKEN.IMPORT:
            index++;
            importStatement();
            break;
        //アクセス修飾子の場合
        case TOKEN.PUBLIC:
        case TOKEN.PRIVATE:
            index++;
            //クラス定義の関数
            classDefinition();
            classIndex++;
            break;
    }
}

//import文の関数
//引数：なし
//返り値：なし
function importStatement(){

    //識別子でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
        throw new Error("importの後に識別子がありません");
    }
    index++;

    //トークンが.の間繰り返す
    while(tokenNums[index].tokenNum === TOKEN.DOT){
        index++;
        //識別子またはArrayListでなければエラー
        if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER && tokenNums[index].tokenNum !== TOKEN.ARRAYLIST){
            throw new Error("import文の.の後に識別子またはArrayListがありません");
        }
        index++;
    }

    //;でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
        throw new Error("import文が;で終わっていません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

}

//クラス定義の関数
//引数：クラス名
//返り値：なし
function classDefinition(){

    //クラスでなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.CLASS){
        throw new Error("classがありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptにclassを追加
    JavaScriptCode += "class ";
    index++;

    //クラス名でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
        throw new Error("クラス名がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    //JavaScriptにクラス名を追加
    JavaScriptCode += tokenNums[index].tokenValue+" ";

    //クラス名を配列に格納
    classes.push({className:tokenNums[index].tokenValue,mainFlag:false});
    index++;

    //extendsがある場合
    if(tokenNums[index].tokenNum === TOKEN.EXTENDS){
        //JavaScriptにextendsを追加
        JavaScriptCode += "extends ";
        index++;

        //識別子でなければエラー
        if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
            throw new Error("extendsの後に識別子がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに親クラス名を追加
        JavaScriptCode += tokenNums[index].tokenValue+" ";

        //クラスの親子関係を示す配列に格納
        classRelation.push({parent:tokenNums[index].tokenValue,child:classes[classIndex].className});
        index++;
    }

    //{でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LBRACE){
        throw new Error("{がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに{を追加
    JavaScriptCode += "{\n";
    index++;

    let variable_type;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum !== TOKEN.RBRACE){
        //アクセス修飾子がある場合次のトークンへ
        if(tokenNums[index].tokenNum === TOKEN.PUBLIC || tokenNums[index].tokenNum === TOKEN.PRIVATE){
            //publicの場合
            if(tokenNums[index].tokenNum === TOKEN.PUBLIC){
                publicFlag = true;
            //privateの場合
            }else if(tokenNums[index].tokenNum === TOKEN.PRIVATE){
                publicFlag = false;
            }
            index++;
        }else{
            publicFlag = true;
        }

        //他の修飾子がある場合次のトークンへ
        if(tokenNums[index].tokenNum === TOKEN.STATIC){
            JavaScriptCode += "static ";
            staticFlag = true;
            index++;
        }else{
            staticFlag = false;
        }

        //voidであれば次のトークンへ
        if(tokenNums[index].tokenNum === TOKEN.VOID){
            index++;

        //型であれば型の関数へ
        }else{

            //2個先のトークンが(でなれけばフィールド宣言なのでフラグを立てる
            if(tokenNums[index+2].tokenNum !== TOKEN.LPAREN){
                classFieldFlag = true;
            //戻り値のフラグを立てる
            }else{
                returnFlag = true;
            }

            //型の関数
            variable_type=type();

            returnFlag = false;

        }

        let tmp_JavaScriptCode="";

        //識別子でなければエラー
        if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
            throw new Error("関数名がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //フィールドの場合は変数名を格納
        if(classFieldFlag){
            fieldIdentifiers.push({className:classes[classIndex].className,fieldName:tokenNums[index].tokenValue,type:variable_type,access:publicFlag,static:staticFlag});

        //関数の場合は関数名を格納
        }else{
            //関数はジェネレーター関数として定義
            JavaScriptCode += "*";
            //JavaScriptに関数名を追加
            tmp_JavaScriptCode += tokenNums[index].tokenValue+" ";
            //関数名を配列に格納
            method.push({className:classes[classIndex].className,methodName:tokenNums[index].tokenValue,access:publicFlag,static:staticFlag,argumentName:[],returnType:variable_type});
            //main関数があるかどうかを確認
            if(tokenNums[index].tokenValue=="main"){
                classes[classIndex].mainFlag=true;
            }
        }
        index++;

        //(でなければフィールド宣言として宣言子の並びへ
        if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
            index--;
            declaratorList(variable_type);

            classFieldFlag = false;

            //;でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
                throw new Error("フィールド宣言または変数宣言が;で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

            //JavaScriptに;を追加
            JavaScriptCode += ";\n";

        //(であれば次のトークンへ
        }else {

            JavaScriptCode +=tmp_JavaScriptCode;

            incrementScope();

            //JavaScriptに(を追加
            JavaScriptCode += "(";
            index++;

            //voidであれば次のトークンへ
            if(tokenNums[index].tokenNum === TOKEN.VOID){
                index++;

                //JavaScriptに)を追加
                JavaScriptCode += "){\n";
            }else{
                functionFlag = true;

                fieldDeclaration();

                functionFlag = false;
            }

            //)でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
                throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

            //;でなければ関数宣言の関数へ
            if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
                functionDeclaration();
                index++;
            }else {
                //;であれば関数定義として次のトークンへ
                index++;
            }
        }

        

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("クラス定義が}で終わっていません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
    }

    //JavaScriptに}を追加
    JavaScriptCode += "}\n";
    
}

//型の関数
//引数：なし
//返り値：型
function type(){

    //型を格納しておく変数
    let variable_type;

    //識別子の場合はクラス名かどうかを確認
    if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER){
        //クラスが登場していない場合はエラー
        if(classes.length==0){
            throw new Error("クラスがありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
        //クラス名がない場合はエラー
        for(let i=0;i<classes.length;i++){
            if(tokenNums[index].tokenValue==classes[i].className){
                break;
            }else if(i==classes.length-1){
                throw new Error("クラス名がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
        }

    //型でなければエラー
    }else if(!isTypeToken(tokenNums[index].tokenNum)){
        throw new Error("型がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    //型を格納
    variable_type=tokenNums[index].tokenNum;

    //関数の引数かつフィールド宣言でない場合に型をJavaScriptに追加
    if(!functionFlag  && !classFieldFlag && !returnFlag){
        JavaScriptCode += "let ";
    }
    index++;

    //[があれば次のトークンへ
    if(tokenNums[index].tokenNum === TOKEN.LBRACKET){
        index++;
        if(tokenNums[index].tokenNum !== TOKEN.RBRACKET){
            throw new Error("]で終わっていません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
        index++;

        //フラグを立てる
        arrayFlag = true;
    }

    //型がArrayListの場合は<>がある
    if(tokenNums[index].tokenNum === TOKEN.LT){
        index++;
        type();
        if(tokenNums[index].tokenNum !== TOKEN.GT){
            throw new Error(">で終わっていません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
        index++;
    }

    //型を返す(初期化の際に使用する)
    return variable_type;
}

//フィールド宣言(変数宣言)の関数
//引数：なし
//返り値：なし
function fieldDeclaration(){

    //型の関数
    let variable_type=type();

    //宣言子の並びの関数
    let  variable_name=declaratorList(variable_type);
    
    return variable_name;
}

//宣言子の並びの関数
//引数：型
//返り値：変数名
function declaratorList(variable_type){

    let variable_name;

    //識別子でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子を追加
    JavaScriptCode += tokenNums[index].tokenValue+" ";

    //関数の引数の場合
    if(functionFlag){
        //関数の引数の名前を格納
        method[method.length-1].argumentName.push(tokenNums[index].tokenValue);
    }


    //変数名を格納
    variable_name = tokenNums[index].tokenValue;
    index++;

    //イコールがあれば次のトークンへ
    if(tokenNums[index].tokenNum === TOKEN.EQUALS){

        //JavaScriptに=を追加
        JavaScriptCode += "=";
        index++;

        //型がintの場合
        if(variable_type === TOKEN.INT){
            handleIntegerTypeInitialization("int", true);

        //型がbyteの場合
        }else if(variable_type === TOKEN.BYTE){    
            handleIntegerTypeInitialization("byte", false);

        //型がshortの場合
        }else if(variable_type === TOKEN.SHORT){    
            handleIntegerTypeInitialization("short", false);

        //型がlongの場合
        }else if(variable_type === TOKEN.LONG){    
            handleIntegerTypeInitialization("long", false);

        //型がfloatの場合
        }else if(variable_type === TOKEN.FLOAT){
            //実数でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.REAL){
                throw new Error("float型に実数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

            //演算子である間繰り返す
            while(isOperatorToken(tokenNums[index].tokenNum)){
                index++;
                //実数でなければエラー
                if(tokenNums[index].tokenNum !== TOKEN.REAL){
                    throw new Error("float型に実数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
                index++;
            }

        //型がdoubleの場合
        }else if(variable_type === TOKEN.DOUBLE){
            //実数でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.REAL){
                throw new Error("double型に実数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptに実数を追加
            JavaScriptCode += tokenNums[index].tokenValue;

            //すでに変数があるかを確認しあれば値を代入
            for(let i=0;i<variables.length;i++){
                if(variables[i].Name==variable_name){
                    variables[i].Value=tokenNums[index].tokenValue;
                //最後まで見つからなかった場合はエラー
                }else if(i==variables.length-1){
                    throw new Error("変数が見つかりません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
            }

            index++;

            //演算子である間繰り返す
            while(isOperatorToken(tokenNums[index].tokenNum)){

                //演算子を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;
                //実数でなければエラー
                if(tokenNums[index].tokenNum !== TOKEN.REAL){
                    throw new Error("double型に実数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }

                //JavaScriptに実数を追加
                JavaScriptCode += tokenNums[index].tokenValue;

                index++;
            }

        //型がbooleanの場合
        }else if(variable_type === TOKEN.BOOLEAN){
            //trueまたはfalseでなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.TRUE && tokenNums[index].tokenNum !== TOKEN.FALSE){
                throw new Error("boolean型にtrueまたはfalseがありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;
        
        //型がcharの場合
        }else if(variable_type === TOKEN.CHAR){
            //文字でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.CHAR_LITERAL){
                throw new Error("char型に文字がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

        //型がStringの場合
        }else if(variable_type === TOKEN.STRING){
            //文字列でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.STRING_LITERAL){
                throw new Error("String型に文字列がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptに文字列を追加
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
            index++;

            //プラスがあれば文字列の連結
            if(tokenNums[index].tokenNum === TOKEN.PLUS){
                index++;
                //文字列でなければエラー
                if(tokenNums[index].tokenNum !== TOKEN.STRING_LITERAL){
                    throw new Error("String型ではないものが連結されています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
            }

        //型がArrayListの場合
        }else if(variable_type === TOKEN.ARRAYLIST){
            //newでなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.NEW){
                throw new Error("ArrayList型にnewがありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            index++;

            //ArrayListでなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.ARRAYLIST){
                throw new Error("ArrayList型にArrayListがありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            index++;

            //<でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.LT){
                throw new Error("ArrayList型に<がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            index++;

            //型の関数
            type();

            //>でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.GT){
                throw new Error("ArrayList型に>がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            index++;

            //(でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
                throw new Error("ArrayList型に(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

            //整数または識別子であれば次のトークンへ
            if(tokenNums[index].tokenNum === TOKEN.INTEGER || tokenNums[index].tokenNum === TOKEN.IDENTIFIER){
                index++;
            }

            //)でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
                throw new Error("ArrayList型に)がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

        //識別子の場合    
        }else if(variable_type === TOKEN.IDENTIFIER){

            //newでなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.NEW){
                throw new Error("クラス型にnewがありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptにnewを追加
            JavaScriptCode += "new ";

            index++;

            //クラス名でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
                throw new Error("クラス型にクラス名がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //クラス名がない場合はエラー
            for(let i=0;i<classes.length;i++){
                if(tokenNums[index].tokenValue==classes[i].className){
                    break;
                }else if(i==classes.length-1){
                    throw new Error("クラス名がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
            }

            //クラス名を保存
            let tmp_className = tokenNums[index].tokenValue;

            //JavaScriptにクラス名を追加
            JavaScriptCode += tmp_className;

            index++;

            //()があれば次のトークンへ
            if(tokenNums[index].tokenNum === TOKEN.LPAREN){
                index++;
                if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
                    throw new Error("()で終わっていません"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }

                //JavaScriptに()を追加
                JavaScriptCode += "();\n";
                index++;
            }

            //JavaScriptに識別子と型の文を追加
            JavaScriptCode +="addVariable(\""+variable_name+"\",\""+tmp_className+"\",0,"+scope+")";

        }else {
            throw new Error("型がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //javascriptに;を追加(フィールド宣言の場合は追加しない)
        if(!classFieldFlag){
            JavaScriptCode += ";\n";
        }


        //変数を配列に格納するためにオブジェクトを作成(変数の型は番号から文字へ)
        // 処理が必要な型のみヘルパー関数で処理
        if(variable_type === TOKEN.INT || variable_type === TOKEN.BYTE || variable_type === TOKEN.DOUBLE || 
           variable_type === TOKEN.CHAR || variable_type === TOKEN.STRING){
            addVariableToTable(variable_name, variable_type, arrayFlag);
            if(arrayFlag){
                arrayFlag = false; //フラグを戻す
            }
        }else if(variable_type === TOKEN.SHORT){
            createAndPushVariable(variable_name, "short", 0);
        }else if(variable_type === TOKEN.LONG){
            createAndPushVariable(variable_name, "long", 0);
        }else if(variable_type === TOKEN.FLOAT){
            createAndPushVariable(variable_name, "float", 0.0);
        }else if(variable_type === TOKEN.BOOLEAN){
            createAndPushVariable(variable_name, "boolean", false);
        }else if(variable_type === TOKEN.ARRAYLIST){
            createAndPushVariable(variable_name, "ArrayList", []);
        }
    

        //フィールド宣言の場合はフィールド宣言のコードを追加
        if(classFieldFlag){
            //静的フィールドの場合
            if(staticFlag){
                fieldDeclarationCode += "changeVariableValue(\""+variable_name+"\","+classes[classIndex].className+"."+variable_name+");";
            }else{
                fieldDeclarationCode += "changeVariableValue(\""+variable_name+"\",tmp_filed_claass"+classIndex+"."+variable_name+");";
            }
        }else{
            //JavaScriptに変数の代入をする文を追加
            JavaScriptCode += "changeVariableValue(\""+variable_name+"\","+variable_name+")";
        }

    }else {
        
        //javascriptに;を追加(フィールド宣言と引数の場合は追加しない)
        if(!classFieldFlag && !functionFlag){
            JavaScriptCode += ";\n";
        }

        //関数の引数の場合は){を追加
        if(functionFlag){
            JavaScriptCode += "){\n";
        }

        //変数を配列に格納するためにオブジェクトを作成(変数の型は番号から文字へ)
        // 処理が必要な型のみヘルパー関数で処理
        if(variable_type === TOKEN.INT || variable_type === TOKEN.BYTE || variable_type === TOKEN.DOUBLE || 
           variable_type === TOKEN.CHAR || variable_type === TOKEN.STRING){
            addVariableToTable(variable_name, variable_type, arrayFlag);
            if(arrayFlag){
                arrayFlag = false; //フラグを戻す
            }
        }else if(variable_type === TOKEN.SHORT){
            createAndPushVariable(variable_name, "short", 0);
        }else if(variable_type === TOKEN.LONG){
            createAndPushVariable(variable_name, "long", 0);
        }else if(variable_type === TOKEN.FLOAT){
            createAndPushVariable(variable_name, "float", 0.0);
        }else if(variable_type === TOKEN.BOOLEAN){
            createAndPushVariable(variable_name, "boolean", false);
        }else if(variable_type === TOKEN.ARRAYLIST){
            createAndPushVariable(variable_name, "ArrayList", []);
        }

        //JavaScriptに変数の代入をする文を追加
        JavaScriptCode += "changeVariableValue(\""+variable_name+"\","+variable_name+");\n";
    }

    //,があればもう一度宣言子の並びの関数へ
    if(tokenNums[index].tokenNum === TOKEN.COMMA){
        //JavaScriptに,を追加
        JavaScriptCode += ",";
        index++;
        declaratorList();
    }

    return variable_name;
}

//関数宣言の関数
//引数：なし
//返り値：なし
function functionDeclaration(){

    //クラスの初期化のフラグ
    let classInitFlag = false;

    //{でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LBRACE){
        throw new Error("{がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    //Javascriptに現在の行数を格納する関数を追加
    JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";
    JavaScriptCode += "yield;\n";
    index++;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum !== TOKEN.RBRACE){

        //フラグを戻す
        classInitFlag = false;

        //識別子の場合はクラス名かどうかを確認
        if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER){
            for(let i=0;i<classes.length;i++){

                //クラス名の場合はクラスの初期化のフラグを立てる
                if(tokenNums[index].tokenValue==classes[i].className){
                    classInitFlag = true;

                    //相互関係の配列に追加
                    mutualRelation.push({className:classes[classIndex].className,relation:tokenNums[index].tokenValue});
                    break;
                }
            }
        }

        //型の場合またはクラスの初期化フラグが立っている場合は変数宣言の関数へ
        if(isTypeToken(tokenNums[index].tokenNum) || classInitFlag){
            fieldDeclaration();
            //;でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptに;を追加
            JavaScriptCode += ";\n";

            //JavaScriptに現在の行数を格納する関数を追加
            JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

            //ステップ実行のためのコード
            JavaScriptCode += "yield;\n";
        
        //そうでなければ文の関数へ
        }else{
            statement();
        }

        index++;

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("関数が}で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
    }

    //Javascirptに現在のスコープの変数を削除する関数を追加
    JavaScriptCode += "deleteVariable("+scope+");\n";
    JavaScriptCode += "yield;\n";
    //JavaScriptに}を追加
    JavaScriptCode += "}\n";
    scope--;
}

//文の関数
//引数：なし
//返り値：なし
function statement(){

    //トークンによって処理を分岐
    switch (tokenNums[index].tokenNum){
        //ifの場合
        case TOKEN.IF:
            index++;
            ifStatement();
            break;
        //whileの場合
        case TOKEN.WHILE:
            index++;
            whileStatement();
            break;
        //forの場合
        case TOKEN.FOR:
            index++;
            forStatement();
            break;
        //returnの場合
        case TOKEN.RETURN:
            index++;
            returnStatement();
            //;でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            break;
        //breakの場合
        case TOKEN.BREAK:
            index++;
            breakStatement();
            //;でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            break;


        //superの場合
        case TOKEN.SUPER:
            index++;
            superStatement();
            //;でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            break;
        
        //識別子の場合
        case TOKEN.IDENTIFIER:
            index++;
            identifierStatement();
            //;でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptに;を追加
            JavaScriptCode += ";\n";
            //JavaScriptに改行を追加
            JavaScriptCode += "message.value+=\"\\n\";\n";

            //JavaScriptに現在の行数を格納する関数を追加
            JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

            //ステップ実行のためのコード
            JavaScriptCode += "yield;\n";
            break;
        default:
            throw new Error("文エラー.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            break;
    }
}

//if文の関数
//引数：なし
//返り値：なし
function ifStatement(){

    //ifをJavaScriptに追加
    JavaScriptCode += "if";
    //(でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに(を追加
    JavaScriptCode += "(";
    index++;

    //比較文の関数
    comparisonStatement();

    //)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに)を追加
    JavaScriptCode += ")";
    index++;

    //{がない場合は次の文の関数へ
    if(tokenNums[index].tokenNum !== TOKEN.LBRACE){
        //JavaScriptに{を追加
        JavaScriptCode += "{\n";
        scope++;
        maxScope =scope;
        //文の関数
        statement();
        //Javascirptに現在のスコープの変数を削除する関数を追加
        JavaScriptCode += "deleteVariable("+scope+");\n";

        //Javascriptに現在の行数を格納する関数を追加
        JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

        JavaScriptCode += "yield;\n";
        //JavaScriptに}を追加
        JavaScriptCode += "}";
        scope--;
    
    //{がある場合
    }else{
        //JavaScriptに{を追加
        JavaScriptCode += "{\n";
        index++
        scope++;
        maxScope =scope;
        //文の関数
        statement();

        index++;

        //}でなければエラー
        if(tokenNums[index].tokenNum !== TOKEN.RBRACE){
            throw new Error("}がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
        //Javascirptに現在のスコープの変数を削除する関数を追加
        JavaScriptCode += "deleteVariable("+scope+");\n";

        //Javascriptに現在の行数を格納する関数を追加
        JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

        JavaScriptCode += "yield;\n";
        //JavaScriptに}を追加
        JavaScriptCode += "}";
        scope--;
    }
    
    console.log(index);
    //elseがある間繰り返す
    while(tokenNums[index+1].tokenNum === TOKEN.ELSE){
        //JavaScriptにelseを追加
        JavaScriptCode += "else ";
        index=index+2;
        
        //ifの場合
        if(tokenNums[index].tokenNum === TOKEN.IF){
            index++;
            ifStatement();
            index--;

        //{の場合
        }else if(tokenNums[index].tokenNum === TOKEN.LBRACE){
            scope++;
            maxScope =scope;
            //JavaScriptに{を追加
            JavaScriptCode += "{\n";
            index++;
            statement();

            index++;

            //}でなければエラー
            if(tokenNums[index].tokenNum !== TOKEN.RBRACE){
                throw new Error("}がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            //Javascirptに現在のスコープの変数を削除する関数を追加
            JavaScriptCode += "deleteVariable("+scope+");\n";

            //Javascriptに現在の行数を格納する関数を追加
            JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

            JavaScriptCode += "yield;\n";
            //JavaScriptに}を追加
            JavaScriptCode += "}";
            scope--;
        
        //{がない場合は次の文の関数へ
        }else{
            //JavaScriptに{を追加
            JavaScriptCode += "{\n";
            scope++;
            maxScope =scope;
            //文の関数
            statement();
            //Javascirptに現在のスコープの変数を削除する関数を追加
            JavaScriptCode += "deleteVariable("+scope+");\n";

            //Javascriptに現在の行数を格納する関数を追加
            JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

            JavaScriptCode += "yield;\n";
            //JavaScriptに}を追加
            JavaScriptCode += "}";
            scope--;
        }

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("if文が}で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

    }

    //JavaScriptに改行を追加
    JavaScriptCode += "\n";
}

//比較文の関数
//引数：なし
//返り値：なし
function comparisonStatement(){

    //識別子でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子を追加
    JavaScriptCode += tokenNums[index].tokenValue+" ";
    index++;

    //演算子であれば演算子の関数へ
    if(isOperatorToken(tokenNums[index].tokenNum)){

        //演算子を追加
        JavaScriptCode += tokenNums[index].tokenValue+" ";
        index++;
        operatorStatement();
    }

    //比較演算子でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LT && tokenNums[index].tokenNum !== TOKEN.GT && tokenNums[index].tokenNum !== TOKEN.EQUALS){
        throw new Error("比較演算子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに比較演算子を追加
    JavaScriptCode += tokenNums[index].tokenValue;

    //比較演算子が=の場合
    if(tokenNums[index].tokenNum === TOKEN.EQUALS){
        
        index++;
        //=でなければエラー
        if(tokenNums[index].tokenNum !== TOKEN.EQUALS){
            throw new Error("==でない比較演算子があります.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに=を追加
        JavaScriptCode += "=";
    //大なりまたは小なりの場合
    }else {
        index++;

        //イコールであればJavaScriptに=を追加
        if(tokenNums[index].tokenNum === TOKEN.EQUALS){
            JavaScriptCode += "=";
        }else {
            index--;
        }
    }

    //空白を追加
    JavaScriptCode += " ";
    
    index++;

    //識別子または整数でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER && tokenNums[index].tokenNum !== TOKEN.INTEGER){
        throw new Error("識別子または整数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子または整数を追加
    JavaScriptCode += tokenNums[index].tokenValue;
    index++;

    //演算子である間繰り返す
    while(isOperatorToken(tokenNums[index].tokenNum)){
        //演算子を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
        //識別子または整数でなければエラー
        if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER && tokenNums[index].tokenNum !== TOKEN.INTEGER){
            throw new Error("識別子または整数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに識別子または整数を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }

    //||または&&がある間繰り返す
    while((tokenNums[index].tokenNum === TOKEN.PIPE && tokenNums[index+1].tokenNum === TOKEN.PIPE) || (tokenNums[index].tokenNum === TOKEN.AMPERSAND && tokenNums[index+1].tokenNum === TOKEN.AMPERSAND)){
        //||または&&を追加
        JavaScriptCode += tokenNums[index].tokenValue+tokenNums[index+1].tokenValue;
        index++;
        index++;
        //識別子でなければエラー
        if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
            throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに識別子を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }

}

//while文の関数
//引数：なし
//返り値：なし
function whileStatement(){

    //JavaScriptにwhileを追加
    JavaScriptCode += "while";

    //(でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに(を追加
    JavaScriptCode += "(";
    index++;

    //比較文の関数
    comparisonStatement();

    //)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに)を追加
    JavaScriptCode += ")";
    index++;

    //{でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LBRACE){
        throw new Error("{がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに{を追加
    JavaScriptCode += "{\n";
    index++;
    scope++;
    maxScope =scope;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum !== TOKEN.RBRACE){
        //文の関数
        statement();
        //Javascriptに現在の行数を格納する関数を追加
        JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";
        //Javascriptにyieldを追加
        JavaScriptCode += "yield;\n";
        index++;

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("while文が}で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

    }

    //JavaScriptに}を追加
    JavaScriptCode += "}\n";
    //Javascirptに現在のスコープの変数を削除する関数を追加
    JavaScriptCode += "deleteVariable("+scope+");\n";

    //Javascriptに現在の行数を格納する関数を追加
    JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

    JavaScriptCode += "yield;\n";
    scope--;
}

//for文の関数
//引数：なし
//返り値：なし
function forStatement(){

    scope++;
    maxScope =scope;

    //(でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    index++;

    //型であれば変数宣言の関数へ
    if(isTypeToken(tokenNums[index].tokenNum)){
        fieldDeclaration();

    //そうでなく識別子であれば演算子の関数へ
    }else if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER){
        index++;

        identifierStatement();
    }

    //;と改行を追加
    JavaScriptCode += ";\n";

    //;でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
        throw new Error("for文の;がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //Javascriptに現在の行数を格納する関数を追加
    JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

    //JavaScriptにyieldを追加
    JavaScriptCode += "yield;\n\n";

    //JavaScriptにfor( ;を追加
    JavaScriptCode += "for( ;";
    index++;

    //比較文の関数
    comparisonStatement();

    //;でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
        throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに;を追加
    JavaScriptCode += ";";
    index++;

    //フラグを立てる
    forFlag = true;

    //演算子の関数
    operatorStatement(tokenNums[index].tokenValue);

    //フラグを戻す
    forFlag = false;

    //)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    index++;

    //{でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LBRACE){
        throw new Error("{がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    //JavaScriptに;と改行を追加
    JavaScriptCode += ";\n";
    //Javascriptに現在の行数を格納する関数を追加
    JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";
    //JavaScriptにyieldを追加
    JavaScriptCode += "yield;\n\n";
    index++;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum !== TOKEN.RBRACE){
        //文の関数
        statement();
        //Javascriptに現在の行数を格納する関数を追加
        JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";
        //Javascriptにyieldを追加
        JavaScriptCode += "yield;\n";
        index++;

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("for文が}で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
    }

    //JavaScriptに}を追加
    JavaScriptCode += "}\n";
    //Javascirptに現在のスコープの変数を削除する関数を追加
    JavaScriptCode += "deleteVariable("+scope+");\n";

    //Javascriptに現在の行数を格納する関数を追加
    JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";

    JavaScriptCode += "yield;\n";
    scope--;
}

//return文の関数
//引数：なし
//返り値：なし
function returnStatement(){

    //returnをJavaScriptに追加
    JavaScriptCode += "return ";

    //識別子でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子を追加
    JavaScriptCode += tokenNums[index].tokenValue;
    index++;

}

//break文の関数
//引数：なし
//返り値：なし
function breakStatement(){

    //breakをJavaScriptに追加
    JavaScriptCode += "break";

    //;でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.SEMICOLON){
        throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに;を追加
    JavaScriptCode += ";";

    //ステップ実行のためのコード
    JavaScriptCode += "yield;\n";
    index++;
}

//識別子の文の関数
//引数：なし
//返り値：なし
function identifierStatement(){

    //関数呼び出しの際に前までの文を保存しておく変数
    let tmp_Stirng ="";

    //前のトークンを保存
    tmp_Stirng = tokenNums[index-1].tokenValue;

    //.でない場合は前の識別子をJavaScriptに追加
    if(tokenNums[index].tokenNum !== TOKEN.DOT){
        //フィールド値かどうかを判定して追加
        JavaScriptCode += formatIdentifier(tokenNums[index-1].tokenValue);
    }

    //.がある間繰り返す
    while(tokenNums[index].tokenNum === TOKEN.DOT){
        //JavaScriptに.を追加
        tmp_Stirng += ".";
        index++;

        //printの場合
        if(tokenNums[index].tokenNum === TOKEN.PRINT){
            index++;
            printStatement();

            //while文を抜ける
            break;
        
        //printlnの場合
        }else if(tokenNums[index].tokenNum === TOKEN.PRINTLN){
            index++;
            printlnStatement();

            //while文を抜ける
            break;

        //printfの場合
        }else if(tokenNums[index].tokenNum === TOKEN.PRINTF){
            index++;
            printfStatement();

            //while文を抜ける
            break;
        }

        //識別子でなければエラー
        if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
            throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
        tmp_Stirng += tokenNums[index].tokenValue;
        index++;
    }

    //(であれば関数呼び出しの関数
    if(tokenNums[index].tokenNum === TOKEN.LPAREN){

        //ジェネレーター関数用に関数の情報を保存する変数の宣言を追加
        let functionInfo="tmp_"+tokenNums[index-1].tokenValue;
        JavaScriptCode += "let "+functionInfo+"=";

        //JavaScriptに前までの文を追加
        JavaScriptCode += tmp_Stirng;

        //JavaScriptに(を追加
        JavaScriptCode += "(";
        index++;
        functionCallStatement(functionInfo);
    }


    //イコールまたは＋またはマイナスがあれば次のトークンへ
    if(tokenNums[index].tokenNum === TOKEN.EQUALS || tokenNums[index].tokenNum === TOKEN.PLUS || tokenNums[index].tokenNum === TOKEN.MINUS){

        //識別子を保存
        let identifier = tokenNums[index-1].tokenValue;

        //イコールまたは＋またはマイナスを追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;

        //演算子の関数
        operatorStatement(identifier);
    }

}

//print文の関数
//引数：なし
//返り値：なし
function printStatement(){

    JavaScriptCode += "message.value+=";

    //(でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

    //識別子または文字列であれば次のトークンへ
    if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.STRING_LITERAL){
        //JavaScriptに識別子または文字列を追加
        //識別子の場合
        if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER){
            JavaScriptCode += formatIdentifier(tokenNums[index].tokenValue);
            
        //文字列の場合""を追加
        }else{
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
        }
        index++;
    }

    //演算子があれば演算子の関数へ
    if(isOperatorToken(tokenNums[index].tokenNum)){
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
        //文字列であれば文字列の連結として追加
        if(tokenNums[index].tokenNum === TOKEN.STRING_LITERAL){
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
            index++;
        }else{
            operatorStatement(tokenNums[index].tokenValue);
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

}

//println文の関数
//引数：なし
//返り値：なし
function printlnStatement(){

    //JavaScriptにidがmessageの内容に加えるように追加
    JavaScriptCode += "message.value+=";
    //(でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    index++;

    //識別子または文字列であれば次のトークンへ
    if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.STRING_LITERAL){
        //JavaScriptに識別子または文字列を追加
        //識別子の場合
        if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER){
            JavaScriptCode += formatIdentifier(tokenNums[index].tokenValue);
            
        //文字列の場合""を追加
        }else{
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
        }
        index++;
    }

    //演算子の場合
    if(isOperatorToken(tokenNums[index].tokenNum)){
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
        //文字列であれば文字列の連結として追加
        if(tokenNums[index].tokenNum === TOKEN.STRING_LITERAL){
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
            index++;
        }else{
            operatorStatement(tokenNums[index].tokenValue);
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

}

//printf文の関数
//引数：なし
//返り値：なし
function printfStatement(){

    //書式文を一時保存する変数
    let tmpString = "";

    //JavaScriptにidがmessageの内容に加えるように追加
    JavaScriptCode += "message.value+=";

    //(でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

    //文字列がなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.STRING_LITERAL){
        throw new Error("printf文の書式文がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //書式文を保存
    tmpString += tokenNums[index].tokenValue;
    index++;

    console.log(tmpString);

    //分割した書式文を保存する変数
    let formatStrings = [];

    //書式文を型を指定する指定子で分割
    for(let i=0;i<tmpString.length;i++){
        //%があればその前までをJavaScriptに追加
        if(tmpString[i]=="%"){
            //%の前があれば保存
            if(i!=0){
                formatStrings.push("\""+tmpString.substring(0,i)+"\"");
            }
            //JavaScriptに%を追加
            formatStrings.push("%"+tmpString[i+1]);
            //%の後ろを保存
            tmpString = tmpString.substring(i+2,tmpString.length);
            i=0;
        }

        //最後まで探していれば保存
        if(i==tmpString.length-1){
            formatStrings.push("\""+tmpString+"\"");
        }
    }

    console.log(formatStrings);

    //,がある間繰り返す
    while(tokenNums[index].tokenNum === TOKEN.COMMA){
        index++;

        //前から指定子を探す
        for(let i=0;i<formatStrings.length;i++){
            //指定子があればその添え字を保存
            if(formatStrings[i]=='%d' || formatStrings[i]=='%f' || formatStrings[i]=='%s' || formatStrings[i]=='%c' || formatStrings[i]=='%b'){
                var descriptor_index = i;
                break;
            }
        }

        console.log(descriptor_index);
        

        //識別子または文字列であれば次のトークンへ
        if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.STRING_LITERAL){
            //識別子の場合
            if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER){
                formatStrings[descriptor_index] = formatIdentifier(tokenNums[index].tokenValue);

            //文字列の場合
            }else{
                formatStrings[descriptor_index] += "\""+tokenNums[index].tokenValue+"\"";
            }
            index++;
        }


        //演算子があれば演算子の関数へ
        if(isOperatorToken(tokenNums[index].tokenNum)){
            index++;
            operatorStatement();
        }
    }

    console.log(formatStrings);

    //書式文をJavaScriptに追加
    for(let i=0;i<formatStrings.length;i++){
        JavaScriptCode += formatStrings[i];

        //最後でなければ+を追加
        if(i!=formatStrings.length-1){
            JavaScriptCode += "+";
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

}

//演算子の関数
//引数：なし
//返り値：なし
function operatorStatement(identifier){

    //識別子または整数であれば次のトークンへ
    if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.INTEGER){
        //JavaScriptに整数の場合はそのまま追加
        if(tokenNums[index].tokenNum === TOKEN.INTEGER){
            JavaScriptCode += tokenNums[index].tokenValue;
        //JavaScriptに識別子の場合はフィールド値かどうかを判定
        }else{
            JavaScriptCode += formatIdentifier(tokenNums[index].tokenValue);
        }

        index++;
    }
    //(であれば関数呼び出しの関数
    if(tokenNums[index].tokenNum === TOKEN.LPAREN){

        //JavaScriptに(を追加
        JavaScriptCode += "(";
        index++;
        functionCallStatement();
    }

    //演算子である間繰り返す
    while(isOperatorToken(tokenNums[index].tokenNum)){
        //JavaScriptに演算子を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        //インクリメント用の変数
        let increment_index=tokenNums[index].tokenNum;
        index++;
        //識別子または整数であれば次のトークンへ
        if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.INTEGER){
            //JavaScriptに整数の場合はそのまま追加
            if(tokenNums[index].tokenNum === TOKEN.INTEGER){
                JavaScriptCode += tokenNums[index].tokenValue;
            //JavaScriptに識別子の場合はフィールド値かどうかを判定
            }else{
                JavaScriptCode += formatIdentifier(tokenNums[index].tokenValue);
            }
            index++;
        }

        //インクリメントが++または--の場合は次のトークンへ
        if((increment_index === TOKEN.PLUS && tokenNums[index].tokenNum === TOKEN.PLUS) || (increment_index === TOKEN.MINUS && tokenNums[index].tokenNum === TOKEN.MINUS)){
            
            //JavaScriptに++または--を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;
            break;
        }

    }

    //for文が呼び出し元の場合
    if(forFlag){
        //JavaScriptに){と改行を追加
        JavaScriptCode += "){\n";
    }else{
        //JavaScriptに改行を追加
        JavaScriptCode += ";\n";
    }

    //フィールド値の場合はthis.を付けて追加
    if(fieldIdentifiers.length!=0){
        for(let i=0;i<fieldIdentifiers.length;i++){
            if(fieldIdentifiers[i].fieldName==identifier){
                JavaScriptCode += "changeVariableValue(\""+identifier+"\",this."+identifier+")";
                break;
            }

            //最後まで探してなければそのまま追加
            if(i==fieldIdentifiers.length-1){
                JavaScriptCode += "changeVariableValue(\""+identifier+"\","+identifier+")";
            }
        }
    }else{
        JavaScriptCode += "changeVariableValue(\""+identifier+"\","+identifier+")";
    }

}

//関数呼び出しの関数
//引数：ジェネレーター関数の情報を保存した変数
//返り値：なし
function functionCallStatement(functionInfo){

    //識別子または整数または文字列であれば次のトークンへ
    if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.INTEGER || tokenNums[index].tokenNum === TOKEN.STRING_LITERAL){
        //JavaScriptに識別子または整数または文字列を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }

    //,がある間繰り返す
    while(tokenNums[index].tokenNum === TOKEN.COMMA){
        //JavaScriptに,を追加
        JavaScriptCode += ",";
        index++;

        //識別子または整数または文字列であれば次のトークンへ
        if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.INTEGER || tokenNums[index].tokenNum === TOKEN.STRING_LITERAL){
            //JavaScriptに識別子または整数または文字列を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに)を追加
    JavaScriptCode += ")";
    index++;

    //ジェネレーター関数を実行する文を追加
    JavaScriptCode += ";\n";
    JavaScriptCode += "while(!"+functionInfo+".next().done){\n";
    JavaScriptCode += "yield;\n";
    JavaScriptCode += "}\n";


}

//親クラスの関数等の呼び出し
//引数：なし
//返り値：なし
function superStatement(){

    //ジェネレーター関数用に関数の情報を保存する変数の宣言を追加
    let functionInfo="tmp_"+tokenNums[index+1].tokenValue;
    JavaScriptCode += "let "+functionInfo+"=";

    //JavaScriptにsuperを追加
    JavaScriptCode += "super";

    //.(ドット)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.DOT){
        throw new Error(".(ドット)がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに.を追加
    JavaScriptCode += ".";
    index++;

    //識別子でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.IDENTIFIER){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子を追加
    JavaScriptCode += tokenNums[index].tokenValue;
    index++;

    //(でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.LPAREN){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに(を追加
    JavaScriptCode += "(";
    index++;

    //識別子または整数であれば次のトークンへ
    if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.INTEGER){
        //JavaScriptに識別子または整数を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }

    //,がある間繰り返す
    while(tokenNums[index].tokenNum === TOKEN.COMMA){
        //JavaScriptに,を追加
        JavaScriptCode += ",";
        index++;

        //識別子または整数であれば次のトークンへ
        if(tokenNums[index].tokenNum === TOKEN.IDENTIFIER || tokenNums[index].tokenNum === TOKEN.INTEGER){
            //JavaScriptに識別子または整数を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum !== TOKEN.RPAREN){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに)を追加
    JavaScriptCode += ")";
    index++;

    //JavaScriptに;を追加
    JavaScriptCode += ";\n";

    //ジェネレーター関数を実行する文を追加
    JavaScriptCode += ";\n";
    JavaScriptCode += "while(!"+functionInfo+".next().done){\n";
    JavaScriptCode += "yield;\n";
    JavaScriptCode += "}\n";

}