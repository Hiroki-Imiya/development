/*入力されたプログラムの構文解析を行うJavaScript */

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
let method = [];

//クラスの親と子の関係を示す配列
//親クラス名:parent
//子クラス名:child
let classRelation = [];

//クラスの相互関係を示す配列
//持っているクラス名:className
//相互関係のクラス名:relation
let mutualRelation = [];

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
                    if(fieldIdentifiers[j].type==25){
                        classDiagram += 'int ';
                    }else if(fieldIdentifiers[j].type==26){
                        classDiagram += 'byte ';
                    }else if(fieldIdentifiers[j].type==27){
                        classDiagram += 'short ';
                    }else if(fieldIdentifiers[j].type==28){
                        classDiagram += 'long ';
                    }else if(fieldIdentifiers[j].type==29){
                        classDiagram += 'float ';
                    }else if(fieldIdentifiers[j].type==30){
                        classDiagram += 'double ';
                    }else if(fieldIdentifiers[j].type==31){
                        classDiagram += 'boolean ';
                    }else if(fieldIdentifiers[j].type==32){
                        classDiagram += 'char ';
                    }else if(fieldIdentifiers[j].type==33){
                        classDiagram += 'String ';
                    }else if(fieldIdentifiers[j].type==1){
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

                    classDiagram += method[j].methodName+'()';

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
            classIndex++;
            break;
    }
}

//import文の関数
//引数：なし
//返り値：なし
function importStatement(){

    //識別子でなければエラー
    if(tokenNums[index].tokenNum!=1){
        throw new Error("importの後に識別子がありません");
    }
    index++;

    //トークンが.の間繰り返す
    while(tokenNums[index].tokenNum==64){
        index++;
        //識別子またはArrayListでなければエラー
        if(tokenNums[index].tokenNum!=1 && tokenNums[index].tokenNum!=34){
            throw new Error("import文の.の後に識別子またはArrayListがありません");
        }
        index++;
    }

    //;でなければエラー
    if(tokenNums[index].tokenNum!=69){
        throw new Error("import文が;で終わっていません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

}

//クラス定義の関数
//引数：クラス名
//返り値：なし
function classDefinition(){

    //クラスでなければエラー
    if(tokenNums[index].tokenNum!=6){
        throw new Error("classがありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptにclassを追加
    JavaScriptCode += "class ";
    index++;

    //クラス名でなければエラー
    if(tokenNums[index].tokenNum!=1){
        throw new Error("クラス名がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    //JavaScriptにクラス名を追加
    JavaScriptCode += tokenNums[index].tokenValue+" ";

    //クラス名を配列に格納
    classes.push({className:tokenNums[index].tokenValue,mainFlag:false});
    index++;

    //extendsがある場合
    if(tokenNums[index].tokenNum==22){
        //JavaScriptにextendsを追加
        JavaScriptCode += "extends ";
        index++;

        //識別子でなければエラー
        if(tokenNums[index].tokenNum!=1){
            throw new Error("extendsの後に識別子がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに親クラス名を追加
        JavaScriptCode += tokenNums[index].tokenValue+" ";

        //クラスの親子関係を示す配列に格納
        classRelation.push({parent:tokenNums[index].tokenValue,child:classes[classIndex].className});
        index++;
    }

    //{でなければエラー
    if(tokenNums[index].tokenNum!=57){
        throw new Error("{がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに{を追加
    JavaScriptCode += "{\n";
    index++;

    let variable_type;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum!=58){
        //アクセス修飾子がある場合次のトークンへ
        if(tokenNums[index].tokenNum==14 || tokenNums[index].tokenNum==15){
            //publicの場合
            if(tokenNums[index].tokenNum==14){
                publicFlag = true;
            //privateの場合
            }else if(tokenNums[index].tokenNum==15){
                publicFlag = false;
            }
            index++;
        }else{
            publicFlag = true;
        }

        //他の修飾子がある場合次のトークンへ
        if(tokenNums[index].tokenNum==17){
            JavaScriptCode += "static ";
            staticFlag = true;
            index++;
        }else{
            staticFlag = false;
        }

        //voidであれば次のトークンへ
        if(tokenNums[index].tokenNum==40){
            index++;

        //型であれば型の関数へ
        }else{

            //2個先のトークンが(でなれけばフィールド宣言なのでフラグを立てる
            if(tokenNums[index+2].tokenNum!=55){
                classFieldFlag = true;
            }

            //型の関数
            variable_type=type();

        }

        let tmp_JavaScriptCode="";

        //識別子でなければエラー
        if(tokenNums[index].tokenNum!=1){
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
            method.push({className:classes[classIndex].className,methodName:tokenNums[index].tokenValue,access:publicFlag,static:staticFlag});
            //main関数があるかどうかを確認
            if(tokenNums[index].tokenValue=="main"){
                classes[classIndex].mainFlag=true;
            }
        }
        index++;

        //(でなければフィールド宣言として宣言子の並びへ
        if(tokenNums[index].tokenNum!=55){
            index--;
            declaratorList(variable_type);

            classFieldFlag = false;

            //;でなければエラー
            if(tokenNums[index].tokenNum!=69){
                throw new Error("フィールド宣言または変数宣言が;で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

            //JavaScriptに;を追加
            JavaScriptCode += ";\n";

        //(であれば次のトークンへ
        }else {

            JavaScriptCode +=tmp_JavaScriptCode;

            scope++;
            //増やした後が最大値より小さい場合は最大値より大きくする
            if(scope<=maxScope){
                scope=maxScope+1;
            }

            //最大値を更新
            maxScope=scope;

            //JavaScriptに(を追加
            JavaScriptCode += "(";
            index++;

            //voidであれば次のトークンへ
            if(tokenNums[index].tokenNum==40){
                index++;

                //JavaScriptに)を追加
                JavaScriptCode += "){\n";
            }else{
                functionFlag = true;

                fieldDeclaration();

                functionFlag = false;
            }

            //)でなければエラー
            if(tokenNums[index].tokenNum!=56){
                throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

            //;でなければ関数宣言の関数へ
            if(tokenNums[index].tokenNum!=69){
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
    if(tokenNums[index].tokenNum==1){
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
    }else if(tokenNums[index].tokenNum!=25 && tokenNums[index].tokenNum!=26 && tokenNums[index].tokenNum!=27 && tokenNums[index].tokenNum!=28 && tokenNums[index].tokenNum!=29 && tokenNums[index].tokenNum!=30 && tokenNums[index].tokenNum!=31 && tokenNums[index].tokenNum!=32 && tokenNums[index].tokenNum!=33 && tokenNums[index].tokenNum!=34){
        throw new Error("型がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    //型を格納
    variable_type=tokenNums[index].tokenNum;

    //関数の引数かつフィールド宣言でない場合に型をJavaScriptに追加
    if(!functionFlag  && !classFieldFlag){
        JavaScriptCode += "let ";
    }
    index++;

    //[があれば次のトークンへ
    if(tokenNums[index].tokenNum==59){
        index++;
        if(tokenNums[index].tokenNum!=60){
            throw new Error("]で終わっていません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
        index++;

        //フラグを立てる
        arrayFlag = true;
    }

    //型がArrayListの場合は<>がある
    if(tokenNums[index].tokenNum==61){
        index++;
        type();
        if(tokenNums[index].tokenNum!=62){
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
    if(tokenNums[index].tokenNum!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子を追加
    JavaScriptCode += tokenNums[index].tokenValue+" ";


    //変数名を格納
    variable_name = tokenNums[index].tokenValue;
    index++;

    //イコールがあれば次のトークンへ
    if(tokenNums[index].tokenNum==70){

        //JavaScriptに=を追加
        JavaScriptCode += "=";
        index++;

        //型がintの場合
        if(variable_type==25){
            //整数または識別子でなければエラー
            if(tokenNums[index].tokenNum!=35 && tokenNums[index].tokenNum!=1){
                throw new Error("int型に整数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptに整数を追加
            JavaScriptCode += tokenNums[index].tokenValue;

            index++;

            //演算子である間繰り返す
            while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
                //演算子を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                
                index++;

                //整数または識別子でなければエラー
                if(tokenNums[index].tokenNum!=35 && tokenNums[index].tokenNum!=1){
                    throw new Error("int型に整数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
                //JavaScriptに整数を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;
            }

        //型がbyteの場合
        }else if(variable_type==26){    
            //整数でなければエラー
            if(tokenNums[index].tokenNum!=35){
                throw new Error("byte型に整数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            //JavaScriptに整数を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;
            
            //演算子である間繰り返す
            while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
                //演算子を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;

                //整数でなければエラー
                if(tokenNums[index].tokenNum!=35){
                    throw new Error("byte型に整数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
                //JavaScriptに整数を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;
            }

        //型がshortの場合
        }else if(variable_type==27){    
            //整数でなければエラー
            if(tokenNums[index].tokenNum!=35){
                throw new Error("short型に整数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            //JavaScriptに整数を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;

            //演算子である間繰り返す
            while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
                //演算子を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;
                
                //整数でなければエラー
                if(tokenNums[index].tokenNum!=35){
                    throw new Error("short型に整数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
                //JavaScriptに整数を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;
            }

        //型がlongの場合
        }else if(variable_type==28){    
            //整数でなければエラー
            if(tokenNums[index].tokenNum!=35){
                throw new Error("long型に整数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            //JavaScriptに整数を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;

            //演算子である間繰り返す
            while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
                //演算子を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;
                //整数でなければエラー
                if(tokenNums[index].tokenNum!=35){
                    throw new Error("long型に整数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
                //JavaScriptに整数を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;
            }

        //型がfloatの場合
        }else if(variable_type==29){
            //実数でなければエラー
            if(tokenNums[index].tokenNum!=36){
                throw new Error("float型に実数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

            //演算子である間繰り返す
            while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
                index++;
                //実数でなければエラー
                if(tokenNums[index].tokenNum!=36){
                    throw new Error("float型に実数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
                index++;
            }

        //型がdoubleの場合
        }else if(variable_type==30){
            //実数でなければエラー
            if(tokenNums[index].tokenNum!=36){
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
            while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){

                //演算子を追加
                JavaScriptCode += tokenNums[index].tokenValue;
                index++;
                //実数でなければエラー
                if(tokenNums[index].tokenNum!=36){
                    throw new Error("double型に実数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }

                //JavaScriptに実数を追加
                JavaScriptCode += tokenNums[index].tokenValue;

                index++;
            }

        //型がbooleanの場合
        }else if(variable_type==31){
            //trueまたはfalseでなければエラー
            if(tokenNums[index].tokenNum!=38 && tokenNums[index].tokenNum!=39){
                throw new Error("boolean型にtrueまたはfalseがありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;
        
        //型がcharの場合
        }else if(variable_type==32){
            //文字でなければエラー
            if(tokenNums[index].tokenNum!=41){
                throw new Error("char型に文字がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

        //型がStringの場合
        }else if(variable_type==33){
            //文字列でなければエラー
            if(tokenNums[index].tokenNum!=37){
                throw new Error("String型に文字列がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptに文字列を追加
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
            index++;

            //プラスがあれば文字列の連結
            if(tokenNums[index].tokenNum==50){
                index++;
                //文字列でなければエラー
                if(tokenNums[index].tokenNum!=37){
                    throw new Error("String型ではないものが連結されています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
            }

        //型がArrayListの場合
        }else if(variable_type==34){
            //newでなければエラー
            if(tokenNums[index].tokenNum!=13){
                throw new Error("ArrayList型にnewがありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            index++;

            //ArrayListでなければエラー
            if(tokenNums[index].tokenNum!=34){
                throw new Error("ArrayList型にArrayListがありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            index++;

            //<でなければエラー
            if(tokenNums[index].tokenNum!=61){
                throw new Error("ArrayList型に<がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            index++;

            //型の関数
            type();

            //>でなければエラー
            if(tokenNums[index].tokenNum!=62){
                throw new Error("ArrayList型に>がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            index++;

            //(でなければエラー
            if(tokenNums[index].tokenNum!=55){
                throw new Error("ArrayList型に(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

            //整数または識別子であれば次のトークンへ
            if(tokenNums[index].tokenNum==35 || tokenNums[index].tokenNum==1){
                index++;
            }

            //)でなければエラー
            if(tokenNums[index].tokenNum!=56){
                throw new Error("ArrayList型に)がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

        //識別子の場合    
        }else if(variable_type==1){

            //newでなければエラー
            if(tokenNums[index].tokenNum!=13){
                throw new Error("クラス型にnewがありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptにnewを追加
            JavaScriptCode += "new ";

            index++;

            //クラス名でなければエラー
            if(tokenNums[index].tokenNum!=1){
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
            if(tokenNums[index].tokenNum==55){
                index++;
                if(tokenNums[index].tokenNum!=56){
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
        if(variable_type==25){
            //配列の場合
            if(arrayFlag){
                //フィールドの場合
                if(classFieldFlag){
                    fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"int[]\",[],"+scope+");\n";
                }else {
                    JavaScriptCode += "addVariable(\""+variable_name+"\",\"int[]\",[],"+scope+");\n";
                }

                //フラグを戻す
                arrayFlag = false;
            }else {
                //フィールドの場合
                if(classFieldFlag){
                    fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"int\",0,"+scope+");\n";
                }else {
                    JavaScriptCode += "addVariable(\""+variable_name+"\",\"int\",0,"+scope+");\n";
                }
            }
        }else if(variable_type==26){
            //配列の場合
            if(arrayFlag){
                //フィールドの場合
                if(classFieldFlag){
                    fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"byte[]\",[],"+scope+");\n";

                }else {
                    JavaScriptCode += "addVariable(\""+variable_name+"\",\"byte[]\",[],"+scope+");\n";
                }

                //フラグを戻す
                arrayFlag = false;
            }else {
                //フィールドの場合
                if(classFieldFlag){
                    fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"byte\",0,"+scope+");\n";
                }else {
                    JavaScriptCode += "addVariable(\""+variable_name+"\",\"byte\",0,"+scope+");\n";
                }
            }
        }else if(variable_type==27){
            let variable = {
                Name:variable_name,
                Type:"short",
                Value:0,
                Scope:scope
            };
        
            //変数を配列に格納
            variables.push(variable);
        }else if(variable_type==28){
            let variable = {
                Name:variable_name,
                Type:"long",
                Value:0,
                Scope:scope
            };
        
            //変数を配列に格納
            variables.push(variable);
        }else if(variable_type==29){
            let variable = {
                Name:variable_name,
                Type:"float",
                Value:0.0,
                Scope:scope
            };
        
            //変数を配列に格納
            variables.push(variable);
        }else if(variable_type==30){
            //配列の場合
            if(arrayFlag){
                //フィールドの場合
                if(classFieldFlag){
                    fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"double[]\",[],"+scope+");\n";
                }else {
                    JavaScriptCode += "addVariable(\""+variable_name+"\",\"double[]\",[],"+scope+");\n";
                }

                //フラグを戻す
                arrayFlag = false;
            }else {
                //フィールドの場合
                if(classFieldFlag){
                    fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"double\",0.0,"+scope+");\n";
                }else {
                    JavaScriptCode += "addVariable(\""+variable_name+"\",\"double\",0.0,"+scope+");\n";
                }
            }
        }else if(variable_type==31){
            let variable = {
                Name:variable_name,
                Type:"boolean",
                Value:false,
                Scope:scope
            };
        
            //変数を配列に格納
            variables.push(variable);
        }else if(variable_type==32){
            JavaScriptCode += "addVariable(\""+variable_name+"\",\"char\",'a',"+scope+");\n";
        }else if(variable_type==33){
            //配列の場合
            if(arrayFlag){
                //フィールドの場合
                if(classFieldFlag){
                    fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"String[]\",[],"+scope+");\n";
                }else {
                    JavaScriptCode += "addVariable(\""+variable_name+"\",\"String[]\",[],"+scope+");\n";
                }

                //フラグを戻す
                arrayFlag = false;
            }else {
                //フィールドの場合
                if(classFieldFlag){
                    fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"String\",\"\","+scope+");\n";
                }else {
                    JavaScriptCode += "addVariable(\""+variable_name+"\",\"String\",\"\","+scope+");\n";
                }
            }
        }else if(variable_type==34){
            let variable = {
                Name:variable_name,
                Type:"ArrayList",
                Value:[],
                Scope:scope
            };

            //変数を配列に格納
            variables.push(variable);
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
        //関数の引数でなければ変数
        if(!functionFlag){
            //javascriptに;を追加(フィールド宣言の場合は追加しない)
            if(!classFieldFlag){
                JavaScriptCode += ";\n";
            }

            //変数を配列に格納するためにオブジェクトを作成(変数の型は番号から文字へ)
            if(variable_type==25){
                //配列の場合
                if(arrayFlag){
                    //フィールドの場合
                    if(classFieldFlag){
                        fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"int[]\",[],"+scope+");\n";
                    }else {
                        JavaScriptCode += "addVariable(\""+variable_name+"\",\"int[]\",[],"+scope+");\n";
                    }

                    //フラグを戻す
                    arrayFlag = false;
                }else {
                    //フィールドの場合
                    if(classFieldFlag){
                        fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"int\",0,"+scope+");\n";
                    }else {
                        JavaScriptCode += "addVariable(\""+variable_name+"\",\"int\",0,"+scope+");\n";
                    }
                }
            }else if(variable_type==26){
                //配列の場合
                if(arrayFlag){
                    //フィールドの場合
                    if(classFieldFlag){
                        fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"byte[]\",[],"+scope+");\n";

                    }else {
                        JavaScriptCode += "addVariable(\""+variable_name+"\",\"byte[]\",[],"+scope+");\n";
                    }

                    //フラグを戻す
                    arrayFlag = false;
                }else {
                    //フィールドの場合
                    if(classFieldFlag){
                        fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"byte\",0,"+scope+");\n";
                    }else {
                        JavaScriptCode += "addVariable(\""+variable_name+"\",\"byte\",0,"+scope+");\n";
                    }
                }
            }else if(variable_type==27){
                let variable = {
                    Name:variable_name,
                    Type:"short",
                    Value:0,
                    Scope:scope
                };
            
                //変数を配列に格納
                variables.push(variable);
            }else if(variable_type==28){
                let variable = {
                    Name:variable_name,
                    Type:"long",
                    Value:0,
                    Scope:scope
                };
            
                //変数を配列に格納
                variables.push(variable);
            }else if(variable_type==29){
                let variable = {
                    Name:variable_name,
                    Type:"float",
                    Value:0.0,
                    Scope:scope
                };
            
                //変数を配列に格納
                variables.push(variable);
            }else if(variable_type==30){
                //配列の場合
                if(arrayFlag){
                    //フィールドの場合
                    if(classFieldFlag){
                        fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"double[]\",[],"+scope+");\n";
                    }else {
                        JavaScriptCode += "addVariable(\""+variable_name+"\",\"double[]\",[],"+scope+");\n";
                    }

                    //フラグを戻す
                    arrayFlag = false;
                }else {
                    //フィールドの場合
                    if(classFieldFlag){
                        fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"double\",0.0,"+scope+");\n";
                    }else {
                        JavaScriptCode += "addVariable(\""+variable_name+"\",\"double\",0.0,"+scope+");\n";
                    }
                }
            }else if(variable_type==31){
                let variable = {
                    Name:variable_name,
                    Type:"boolean",
                    Value:false,
                    Scope:scope
                };
            
                //変数を配列に格納
                variables.push(variable);
            }else if(variable_type==32){
                JavaScriptCode += "addVariable(\""+variable_name+"\",\"char\",'a',"+scope+");\n";
            }else if(variable_type==33){
                //配列の場合
                if(arrayFlag){
                    //フィールドの場合
                    if(classFieldFlag){
                        fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"String[]\",[],"+scope+");\n";
                    }else {
                        JavaScriptCode += "addVariable(\""+variable_name+"\",\"String[]\",[],"+scope+");\n";
                    }

                    //フラグを戻す
                    arrayFlag = false;
                }else {
                    //フィールドの場合
                    if(classFieldFlag){
                        fieldDeclarationCode += "addVariable(\""+variable_name+"\",\"String\",\"\","+scope+");\n";
                    }else {
                        JavaScriptCode += "addVariable(\""+variable_name+"\",\"String\",\"\","+scope+");\n";
                    }
                }
            }else if(variable_type==34){
                let variable = {
                    Name:variable_name,
                    Type:"ArrayList",
                    Value:[],
                    Scope:scope
                };

                //変数を配列に格納
                variables.push(variable);
            }
        }else {
            //関数の引数の場合
            //変数を配列に格納するためにオブジェクトを作成(変数の型は番号から文字へ)
            if(variable_type==25){
                //配列の場合
                if(arrayFlag){
                    addVariable(variable_name,"int[]",[],scope);

                    //フラグを戻す
                    arrayFlag = false;
                }else {
                    addVariable(variable_name,"int",0,scope);
                }
            }else if(variable_type==26){
                //配列の場合
                if(arrayFlag){
                    addVariable(variable_name,"byte[]",[],scope);

                    //フラグを戻す
                    arrayFlag = false;
                }else {
                    addVariable(variable_name,"byte",0,scope);
                }
            }else if(variable_type==27){
                let variable = {
                    Name:variable_name,
                    Type:"short",
                    Value:0,
                    Scope:scope
                };
            
                //変数を配列に格納
                variables.push(variable);
            }else if(variable_type==28){
                let variable = {
                    Name:variable_name,
                    Type:"long",
                    Value:0,
                    Scope:scope
                };
            
                //変数を配列に格納
                variables.push(variable);
            }else if(variable_type==29){
                let variable = {
                    Name:variable_name,
                    Type:"float",
                    Value:0.0,
                    Scope:scope
                };
            
                //変数を配列に格納
                variables.push(variable);
            }else if(variable_type==30){
                //配列の場合
                if(arrayFlag){
                    addVariable(variable_name,"double[]",[],scope);

                    //フラグを戻す
                    arrayFlag = false;
                }else {
                    addVariable(variable_name,"double",0.0,scope);
                }
            }else if(variable_type==31){
                let variable = {
                    Name:variable_name,
                    Type:"boolean",
                    Value:false,
                    Scope:scope
                };
            
                //変数を配列に格納
                variables.push(variable);
            }else if(variable_type==32){
                addVariable(variable_name,"char",'');
            }else if(variable_type==33){
                //配列の場合
                if(arrayFlag){
                    addVariable(variable_name,"String[]",[],scope);

                    //フラグを戻す
                    arrayFlag = false;
                }else {
                    addVariable(variable_name,"String","",scope);
                }
            }else if(variable_type==34){
                let variable = {
                    Name:variable_name,
                    Type:"ArrayList",
                    Value:[],
                    Scope:scope
                };

                //変数を配列に格納
                variables.push(variable);
            }

            JavaScriptCode +="){\n";

            JavaScriptCode += "addVariable(\""+variable_name+"\",\""+variable_type+"\",0,"+scope+");\n";

            //JavaScriptに変数の代入をする文を追加
            JavaScriptCode += "changeVariableValue(\""+variable_name+"\","+variable_name+");\n";
        }
    }

    //,があればもう一度宣言子の並びの関数へ
    if(tokenNums[index].tokenNum==63){
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
    if(tokenNums[index].tokenNum!=57){
        throw new Error("{がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    //Javascriptに現在の行数を格納する関数を追加
    JavaScriptCode += "saveLine("+tokenNums[index].row+");\n";
    JavaScriptCode += "yield;\n";
    index++;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum!=58){

        //フラグを戻す
        classInitFlag = false;

        //識別子の場合はクラス名かどうかを確認
        if(tokenNums[index].tokenNum==1){
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
        if(tokenNums[index].tokenNum==25 || tokenNums[index].tokenNum==26 || tokenNums[index].tokenNum==27 || tokenNums[index].tokenNum==28 || tokenNums[index].tokenNum==29 || tokenNums[index].tokenNum==30 || tokenNums[index].tokenNum==31 || tokenNums[index].tokenNum==32 || tokenNums[index].tokenNum==33 || tokenNums[index].tokenNum==34 || classInitFlag){
            fieldDeclaration();
            //;でなければエラー
            if(tokenNums[index].tokenNum!=69){
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
        case 7:
            index++;
            ifStatement();
            break;
        //whileの場合
        case 9:
            index++;
            whileStatement();
            break;
        //forの場合
        case 10:
            index++;
            forStatement();
            break;
        //returnの場合
        case 11:
            index++;
            returnStatement();
            //;でなければエラー
            if(tokenNums[index].tokenNum!=69){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            break;
        //breakの場合
        case 12:
            index++;
            breakStatement();
            //;でなければエラー
            if(tokenNums[index].tokenNum!=69){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            break;


        //superの場合
        case 43:
            index++;
            superStatement();
            //;でなければエラー
            if(tokenNums[index].tokenNum!=69){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            break;
        
        //識別子の場合
        case 1:
            index++;
            identifierStatement();
            //;でなければエラー
            if(tokenNums[index].tokenNum!=69){
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
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに(を追加
    JavaScriptCode += "(";
    index++;

    //比較文の関数
    comparisonStatement();

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに)を追加
    JavaScriptCode += ")";
    index++;

    //{がない場合は次の文の関数へ
    if(tokenNums[index].tokenNum!=57){
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
        if(tokenNums[index].tokenNum!=58){
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
    while(tokenNums[index+1].tokenNum==8){
        //JavaScriptにelseを追加
        JavaScriptCode += "else ";
        index=index+2;
        
        //ifの場合
        if(tokenNums[index].tokenNum==7){
            index++;
            ifStatement();
            index--;

        //{の場合
        }else if(tokenNums[index].tokenNum==57){
            scope++;
            maxScope =scope;
            //JavaScriptに{を追加
            JavaScriptCode += "{\n";
            index++;
            statement();

            index++;

            //}でなければエラー
            if(tokenNums[index].tokenNum!=58){
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
    if(tokenNums[index].tokenNum!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子を追加
    JavaScriptCode += tokenNums[index].tokenValue+" ";
    index++;

    //演算子であれば演算子の関数へ
    if(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){

        //演算子を追加
        JavaScriptCode += tokenNums[index].tokenValue+" ";
        index++;
        operatorStatement();
    }

    //比較演算子でなければエラー
    if(tokenNums[index].tokenNum!=61 && tokenNums[index].tokenNum!=62 && tokenNums[index].tokenNum!=70){
        throw new Error("比較演算子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに比較演算子を追加
    JavaScriptCode += tokenNums[index].tokenValue;

    //比較演算子が=の場合
    if(tokenNums[index].tokenNum==70){
        
        index++;
        //=でなければエラー
        if(tokenNums[index].tokenNum!=70){
            throw new Error("==でない比較演算子があります.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに=を追加
        JavaScriptCode += "=";
    //大なりまたは小なりの場合
    }else {
        index++;

        //イコールであればJavaScriptに=を追加
        if(tokenNums[index].tokenNum==70){
            JavaScriptCode += "=";
        }else {
            index--;
        }
    }

    //空白を追加
    JavaScriptCode += " ";
    
    index++;

    //識別子または整数でなければエラー
    if(tokenNums[index].tokenNum!=1 && tokenNums[index].tokenNum!=35){
        throw new Error("識別子または整数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子または整数を追加
    JavaScriptCode += tokenNums[index].tokenValue;
    index++;

    //演算子である間繰り返す
    while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
        //演算子を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
        //識別子または整数でなければエラー
        if(tokenNums[index].tokenNum!=1 && tokenNums[index].tokenNum!=35){
            throw new Error("識別子または整数がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに識別子または整数を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }

    //||または&&がある間繰り返す
    while((tokenNums[index].tokenNum==65 && tokenNums[index+1]==65) || (tokenNums[index].tokenNum==66 && tokenNums[index+1]==66)){
        //||または&&を追加
        JavaScriptCode += tokenNums[index].tokenValue+tokenNums[index+1].tokenValue;
        index++;
        index++;
        //識別子でなければエラー
        if(tokenNums[index].tokenNum!=1){
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
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに(を追加
    JavaScriptCode += "(";
    index++;

    //比較文の関数
    comparisonStatement();

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに)を追加
    JavaScriptCode += ")";
    index++;

    //{でなければエラー
    if(tokenNums[index].tokenNum!=57){
        throw new Error("{がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに{を追加
    JavaScriptCode += "{\n";
    index++;
    scope++;
    maxScope =scope;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum!=58){
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
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    index++;

    //型であれば変数宣言の関数へ
    if(tokenNums[index].tokenNum==25 || tokenNums[index].tokenNum==26 || tokenNums[index].tokenNum==27 || tokenNums[index].tokenNum==28 || tokenNums[index].tokenNum==29 || tokenNums[index].tokenNum==30 || tokenNums[index].tokenNum==31 || tokenNums[index].tokenNum==32 || tokenNums[index].tokenNum==33 || tokenNums[index].tokenNum==34){
        fieldDeclaration();

    //そうでなく識別子であれば演算子の関数へ
    }else if(tokenNums[index].tokenNum==1){
        index++;

        identifierStatement();
    }

    //;と改行を追加
    JavaScriptCode += ";\n";

    //;でなければエラー
    if(tokenNums[index].tokenNum!=69){
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
    if(tokenNums[index].tokenNum!=69){
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
    if(tokenNums[index].tokenNum!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    index++;

    //{でなければエラー
    if(tokenNums[index].tokenNum!=57){
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
    while(tokenNums[index].tokenNum!=58){
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
    JavaScriptCode += "return";

    //識別子でなければエラー
    if(tokenNums[index].tokenNum!=1){
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
    if(tokenNums[index].tokenNum!=69){
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
    if(tokenNums[index].tokenNum!=64){
        //そのときに識別子がフィールド値の場合はthis.を付けて追加
        for(let i=0;i<fieldIdentifiers.length;i++){
            if(fieldIdentifiers[i].fieldName==tokenNums[index-1].tokenValue){
                JavaScriptCode += "this."+tokenNums[index-1].tokenValue;
                break;
            }

            //最後まで探してなければそのまま追加
            if(i==fieldIdentifiers.length-1){
                JavaScriptCode += tokenNums[index-1].tokenValue;
            }
        }
    }

    //.がある間繰り返す
    while(tokenNums[index].tokenNum==64){
        //JavaScriptに.を追加
        tmp_Stirng += ".";
        index++;

        //printの場合
        if(tokenNums[index].tokenNum==2){
            index++;
            printStatement();

            //while文を抜ける
            break;
        
        //printlnの場合
        }else if(tokenNums[index].tokenNum==3){
            index++;
            printlnStatement();

            //while文を抜ける
            break;

        //printfの場合
        }else if(tokenNums[index].tokenNum==4){
            index++;
            printfStatement();

            //while文を抜ける
            break;
        }

        //識別子でなければエラー
        if(tokenNums[index].tokenNum!=1){
            throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
        tmp_Stirng += tokenNums[index].tokenValue;
        index++;
    }

    //(であれば関数呼び出しの関数
    if(tokenNums[index].tokenNum==55){

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
    if(tokenNums[index].tokenNum==70 || tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51){

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
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

    //識別子または文字列であれば次のトークンへ
    if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==37){
        //JavaScriptに識別子または文字列を追加
        //識別子の場合
        if(tokenNums[index].tokenNum==1){

            //フィールド値が存在していない場合
            if(fieldIdentifiers.length==0){
                //そのまま追加
                JavaScriptCode += tokenNums[index].tokenValue;
            
            //存在している場合はフィールド値かどうかを判定
            }else{
                for(let i=0;i<fieldIdentifiers.length;i++){
                    //フィールド値の場合はthis.を付けて追加
                    if(fieldIdentifiers[i].fieldName==tokenNums[index].tokenValue){
                        JavaScriptCode += "this."+tokenNums[index].tokenValue;
                        break;
                    }

                    //最後まで探してなければそのまま追加
                    if(i==fieldIdentifiers.length-1){
                        JavaScriptCode += tokenNums[index].tokenValue;
                    }
                }
            }
            
        //文字列の場合""を追加
        }else{
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
        }
        index++;
    }

    //演算子があれば演算子の関数へ
    if(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
        //文字列であれば文字列の連結として追加
        if(tokenNums[index].tokenNum==37){
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
            index++;
        }else{
            operatorStatement(tokenNums[index].tokenValue);
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
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
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    index++;

    //識別子または文字列であれば次のトークンへ
    if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==37){
        //JavaScriptに識別子または文字列を追加
        //識別子の場合
        if(tokenNums[index].tokenNum==1){

            //フィールド値が存在していない場合
            if(fieldIdentifiers.length==0){
                //そのまま追加
                JavaScriptCode += tokenNums[index].tokenValue;
            
            //存在している場合はフィールド値かどうかを判定
            }else{
                for(let i=0;i<fieldIdentifiers.length;i++){
                    //フィールド値の場合はthis.を付けて追加
                    if(fieldIdentifiers[i].fieldName==tokenNums[index].tokenValue){
                        JavaScriptCode += "this."+tokenNums[index].tokenValue;
                        break;
                    }

                    //最後まで探してなければそのまま追加
                    if(i==fieldIdentifiers.length-1){
                        JavaScriptCode += tokenNums[index].tokenValue;
                    }
                }
            }
            
        //文字列の場合""を追加
        }else{
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
        }
        index++;
    }

    //演算子の場合
    if(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
        //文字列であれば文字列の連結として追加
        if(tokenNums[index].tokenNum==37){
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
            index++;
        }else{
            operatorStatement(tokenNums[index].tokenValue);
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
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
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

    //文字列がなければエラー
    if(tokenNums[index].tokenNum!=37){
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
    while(tokenNums[index].tokenNum==63){
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
        if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==37){
            //識別子の場合
            if(tokenNums[index].tokenNum==1){
                //フィールド値が存在していない場合
                if(fieldIdentifiers.length==0){
                    //そのまま追加
                    formatStrings[descriptor_index] = tokenNums[index].tokenValue;
                }else{
                    for(let i=0;i<fieldIdentifiers.length;i++){
                        //フィールド値の場合はthis.を付けて追加
                        if(fieldIdentifiers[i].fieldName==tokenNums[index].tokenValue){
                            formatStrings[descriptor_index] = "this."+tokenNums[index].tokenValue;
                            break;
                        }

                        //最後まで探してなければそのまま追加
                        if(i==fieldIdentifiers.length-1){
                            formatStrings[descriptor_index] = tokenNums[index].tokenValue;
                        }
                    }
                }

            //文字列の場合
            }else{
                formatStrings[descriptor_index] += "\""+tokenNums[index].tokenValue+"\"";
            }
            index++;
        }


        //演算子があれば演算子の関数へ
        if(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
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
    if(tokenNums[index].tokenNum!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

}

//演算子の関数
//引数：なし
//返り値：なし
function operatorStatement(identifier){

    //識別子または整数であれば次のトークンへ
    if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==35){
        //JavaScriptに識別子または整数を追加 
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }
    //(であれば関数呼び出しの関数
    if(tokenNums[index].tokenNum==55){

        //JavaScriptに(を追加
        JavaScriptCode += "(";
        index++;
        functionCallStatement();
    }

    //演算子である間繰り返す
    while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
        //JavaScriptに演算子を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        //インクリメント用の変数
        let increment_index=tokenNums[index].tokenNum;
        index++;
        //識別子または整数であれば次のトークンへ
        if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==35){
            //JavaScriptに識別子または整数を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;
        }

        //インクリメントが++または--の場合は次のトークンへ
        if((increment_index==50 && tokenNums[index].tokenNum==50) || (increment_index==51 && tokenNums[index].tokenNum==51)){
            
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

    //JavaScriptに代入するコードを追加
    JavaScriptCode += "changeVariableValue(\""+identifier+"\","+identifier+")";

}

//関数呼び出しの関数
//引数：ジェネレーター関数の情報を保存した変数
//返り値：なし
function functionCallStatement(functionInfo){

    //識別子または整数または文字列であれば次のトークンへ
    if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==35 || tokenNums[index].tokenNum==37){
        //JavaScriptに識別子または整数または文字列を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }

    //,がある間繰り返す
    while(tokenNums[index].tokenNum==63){
        //JavaScriptに,を追加
        JavaScriptCode += ",";
        index++;

        //識別子または整数または文字列であれば次のトークンへ
        if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==35 || tokenNums[index].tokenNum==37){
            //JavaScriptに識別子または整数または文字列を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
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
    if(tokenNums[index].tokenNum!=64){
        throw new Error(".(ドット)がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに.を追加
    JavaScriptCode += ".";
    index++;

    //識別子でなければエラー
    if(tokenNums[index].tokenNum!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子を追加
    JavaScriptCode += tokenNums[index].tokenValue;
    index++;

    //(でなければエラー
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに(を追加
    JavaScriptCode += "(";
    index++;

    //識別子または整数であれば次のトークンへ
    if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==35){
        //JavaScriptに識別子または整数を追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;
    }

    //,がある間繰り返す
    while(tokenNums[index].tokenNum==63){
        //JavaScriptに,を追加
        JavaScriptCode += ",";
        index++;

        //識別子または整数であれば次のトークンへ
        if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==35){
            //JavaScriptに識別子または整数を追加
            JavaScriptCode += tokenNums[index].tokenValue;
            index++;
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
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