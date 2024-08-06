//関数の引数かどうかのフラグ
let functionFlag = false;

//構文解析を行う関数
function syntaxAnalysis(){
    //登場したクラス名またはメソッド名を格納する配列
    let className = [];
    //トークンの数だけ繰り返す
    index=0;
    while(index<tokenNums.length){
        //プログラムの関数
        program(className);
        index++;
    }

    //クラスの作成及びメソッドを実行する文の追加(今のところはクラスは最初の一つのみ)
    for(let i=1;i<className.length;i++){
        JavaScriptCode += className[0]+"."+className[i]+"();\n";
    }

    //mermaidの内容を読み込む
    let classDirgram="classDiagram\n";

    //クラス図の作成(mermaid形式)
    classDirgram += "class "+className[0] + " {\n";
    for(let i=1;i<className.length;i++){
        classDirgram += "+"+className[i] +"()\n";
    }

    classDirgram += "}\n";

    //mermaidのhtmlに追加
    mermaid.innerHTML += classDirgram;

    console.log(classDirgram);

}

//プログラムの関数
function program(className){
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
            classDefinition(className);
            break;
    }
}

//import文の関数
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
function classDefinition(className){

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
    className.push(tokenNums[index].tokenValue);
    index++;

    //{でなければエラー
    if(tokenNums[index].tokenNum!=57){
        throw new Error("{がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに{を追加
    JavaScriptCode += "{\n";
    index++;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum!=58){
        //アクセス修飾子がある場合次のトークンへ
        if(tokenNums[index].tokenNum==14 || tokenNums[index].tokenNum==15){
            index++;
        }

        //他の修飾子がある場合次のトークンへ
        if(tokenNums[index].tokenNum==17){
            JavaScriptCode += "static ";
            index++;
        }

        //voidであれば次のトークンへ
        if(tokenNums[index].tokenNum==40){
            index++;

        //型であれば関数の関数へ
        }else{
            //型の関数
            type();
        }

        //識別子でなければエラー
        if(tokenNums[index].tokenNum!=1){
            throw new Error("関数名がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに関数名を追加
        JavaScriptCode += tokenNums[index].tokenValue+" ";        
        //関数名を配列に格納
        className.push(tokenNums[index].tokenValue);
        index++;

        //(でなければフィールド宣言の関数へ
        if(tokenNums[index].tokenNum!=55){
            fieldDeclaration();

            //;でなければエラー
            if(tokenNums[index].tokenNum!=69){
                throw new Error("フィールド宣言または変数宣言が;で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }
            index++;

        //(であれば次のトークンへ
        }else {

            //JavaScriptに(を追加
            JavaScriptCode += "(";
            index++;

            functionFlag = true;

            fieldDeclaration();

            functionFlag = false;
        }

        //)でなければエラー
        if(tokenNums[index].tokenNum!=56){
            throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに)を追加
        JavaScriptCode += ")";
        index++;

        //;でなければ関数宣言の関数へ
        if(tokenNums[index].tokenNum!=69){
            functionDeclaration();
            index++;
        }else {
            //;であれば関数定義として次のトークンへ
            index++;
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
function type(){

    //型を格納しておく変数
    let variable_type;

    //型でなければエラー
    if(tokenNums[index].tokenNum!=25 && tokenNums[index].tokenNum!=26 && tokenNums[index].tokenNum!=27 && tokenNums[index].tokenNum!=28 && tokenNums[index].tokenNum!=29 && tokenNums[index].tokenNum!=30 && tokenNums[index].tokenNum!=31 && tokenNums[index].tokenNum!=32 && tokenNums[index].tokenNum!=33 && tokenNums[index].tokenNum!=34){
        throw new Error("型がありません"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    //型を格納
    variable_type=tokenNums[index].tokenNum;

    //関数の引数でない場合に型をJavaScriptに追加
    if(!functionFlag){
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
function fieldDeclaration(){

    //型の関数
    let variable_type=type();

    //宣言子の並びの関数
    declaratorList(variable_type);
    
}

//宣言子の並びの関数(引数は変数の型)
function declaratorList(variable_type){

    //識別子でなければエラー
    if(tokenNums[index].tokenNum!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに識別子を追加
    JavaScriptCode += tokenNums[index].tokenValue+" ";

    index++;

    //イコールがあれば次のトークンへ
    if(tokenNums[index].tokenNum==70){

        //JavaScriptに=を追加
        JavaScriptCode += "=";
        index++;

        //型がintの場合
        if(variable_type==25){
            //整数でなければエラー
            if(tokenNums[index].tokenNum!=35){
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

                //整数でなければエラー
                if(tokenNums[index].tokenNum!=35){
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
            index++;

            //演算子である間繰り返す
            while(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
                index++;
                //実数でなければエラー
                if(tokenNums[index].tokenNum!=36){
                    throw new Error("double型に実数以外の計算をしようとしています.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
                }
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


        }else {
            throw new Error("型がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

    }
    //,があればもう一度宣言子の並びの関数へ
    if(tokenNums[index].tokenNum==63){
        //JavaScriptに,を追加
        JavaScriptCode += ",";
        index++;
        declaratorList();
    }

    return;
}

//関数宣言の関数
function functionDeclaration(){

    //{でなければエラー
    if(tokenNums[index].tokenNum!=57){
        throw new Error("{がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに{を追加
    JavaScriptCode += "{\n";
    index++;

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum!=58){

        //型の場合は変数宣言の関数へ
        if(tokenNums[index].tokenNum==25 || tokenNums[index].tokenNum==26 || tokenNums[index].tokenNum==27 || tokenNums[index].tokenNum==28 || tokenNums[index].tokenNum==29 || tokenNums[index].tokenNum==30 || tokenNums[index].tokenNum==31 || tokenNums[index].tokenNum==32 || tokenNums[index].tokenNum==33 || tokenNums[index].tokenNum==34){
            fieldDeclaration();
            //;でなければエラー
            if(tokenNums[index].tokenNum!=69){
                throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptに;を追加
            JavaScriptCode += ";\n";
        
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

    //JavaScriptに}を追加
    JavaScriptCode += "}\n";
}

//文の関数
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
            break;
        default:
            throw new Error("文エラー.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            break;
    }
}

//if文の関数
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

    //{でなければエラー
    if(tokenNums[index].tokenNum!=57){
        throw new Error("{がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに{を追加
    JavaScriptCode += "{\n";
    index++;

    //文の関数
    statement();

    index++;

    //}でなければエラー
    if(tokenNums[index].tokenNum!=58){
        throw new Error("}がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに}を追加
    JavaScriptCode += "}";
    index++;

    //elseがある間繰り返す
    while(tokenNums[index].tokenNum==8){
        //JavaScriptにelseを追加
        JavaScriptCode += "else ";
        index++;
        
        //ifの場合
        if(tokenNums[index].tokenNum==7){
            index++;
            ifStatement();
            index--;

        //{の場合
        }else if(tokenNums[index].tokenNum==57){

            //JavaScriptに{を追加
            JavaScriptCode += "{\n";
            index++;
            statement();

            index++;

            //}でなければエラー
            if(tokenNums[index].tokenNum!=58){
                throw new Error("}がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
            }

            //JavaScriptに}を追加
            JavaScriptCode += "}";
            //index++;
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
    if(tokenNums[index].tokenNum!=61 && tokenNums[index].tokenNum!=62 && tokenNums[index].tokenNum!=69){
        throw new Error("比較演算子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに比較演算子を追加
    JavaScriptCode += tokenNums[index].tokenValue+" ";

    //比較演算子が=の場合
    if(tokenNums[index].tokenNum==69){
        
        //JavaScriptに=を追加
        JavaScriptCode += "=";
        index++;
        //=でなければエラー
        if(tokenNums[index].tokenNum!=70){
            throw new Error("==でない比較演算子があります.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

        //JavaScriptに=を追加
        JavaScriptCode += "=";
    }
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

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum!=58){
        //文の関数
        statement();
        index++;

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("while文が}で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }

    }

    //JavaScriptに}を追加
    JavaScriptCode += "}\n";
}

//for文の関数
function forStatement(){

    //JavaScriptにforを追加
    JavaScriptCode += "for";

    //(でなければエラー
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに(を追加
    JavaScriptCode += "(";
    index++;

    //型であれば変数宣言の関数へ
    if(tokenNums[index].tokenNum==25 || tokenNums[index].tokenNum==26 || tokenNums[index].tokenNum==27 || tokenNums[index].tokenNum==28 || tokenNums[index].tokenNum==29 || tokenNums[index].tokenNum==30 || tokenNums[index].tokenNum==31 || tokenNums[index].tokenNum==32 || tokenNums[index].tokenNum==33 || tokenNums[index].tokenNum==34){
        fieldDeclaration();

    //そうでなく識別子であれば演算子の関数へ
    }else if(tokenNums[index].tokenNum==1){
        index++;

        identifierStatement();
    }

    //;でなければエラー
    if(tokenNums[index].tokenNum!=69){
        throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに;を追加
    JavaScriptCode += ";";
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

    //演算子の関数
    operatorStatement();

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

    //}が来るまで繰り返す
    while(tokenNums[index].tokenNum!=58){
        //文の関数
        statement();
        index++;

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("for文が}で終わっていません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
        }
    }

    //JavaScriptに}を追加
    JavaScriptCode += "}\n";
}

//return文の関数
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
function breakStatement(){

    //breakをJavaScriptに追加
    JavaScriptCode += "break";

    //;でなければエラー
    if(tokenNums[index].tokenNum!=69){
        throw new Error(";がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }

    //JavaScriptに;を追加
    JavaScriptCode += ";";
    index++;
}

//識別子の文の関数
function identifierStatement(){

    //.でない場合は前の識別子をJavaScriptに追加
    if(tokenNums[index].tokenNum!=64){
        JavaScriptCode += tokenNums[index-1].tokenValue;
    }

    //.がある間繰り返す
    while(tokenNums[index].tokenNum==64){
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
        index++;
    }

    //(であれば関数呼び出しの関数
    if(tokenNums[index].tokenNum==55){

        //JavaScriptに(を追加
        JavaScriptCode += "(";
        index++;
        functionCallStatement();
    }


    //イコールまたは＋またはマイナスがあれば次のトークンへ
    if(tokenNums[index].tokenNum==70 || tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51){

        //イコールまたは＋またはマイナスを追加
        JavaScriptCode += tokenNums[index].tokenValue;
        index++;

        //演算子の関数
        operatorStatement();
    }

}

//print文の関数
function printStatement(){

    //(でなければエラー
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

    //識別子または文字列であれば次のトークンへ
    if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==37){
        index++;
    }

    //演算子があれば演算子の関数へ
    if(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
        index++;
        operatorStatement();
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

}

//println文の関数
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
        //識別子の場合はそのまま追加
        if(tokenNums[index].tokenNum==1){
            JavaScriptCode += tokenNums[index].tokenValue;
        //文字列の場合は""を追加
        }else{
            JavaScriptCode += "\""+tokenNums[index].tokenValue+"\"";
        }
        index++;
    }

    //演算子があれば演算子の関数へ
    if(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
        index++;
        operatorStatement();
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

}

//printf文の関数
function printfStatement(){

    //(でなければエラー
    if(tokenNums[index].tokenNum!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

    //文字列であれば次のトークンへ
    if(tokenNums[index].tokenNum==37){
        index++;
    }

    //,がある間繰り返す
    while(tokenNums[index].tokenNum==63){
        index++;

        //識別子または文字列であれば次のトークンへ
        if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==37){
            index++;
        }

        //演算子があれば演算子の関数へ
        if(tokenNums[index].tokenNum==50 || tokenNums[index].tokenNum==51 || tokenNums[index].tokenNum==52 || tokenNums[index].tokenNum==53 || tokenNums[index].tokenNum==54){
            index++;
            operatorStatement();
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

}

//演算子の関数
function operatorStatement(){

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

}

//関数呼び出しの関数
function functionCallStatement(){

    //識別子または整数または文字列でなければエラー
    if(tokenNums[index].tokenNum!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

    //,がある間繰り返す
    while(tokenNums[index].tokenNum==63){
        index++;

        //識別子または整数または文字列であれば次のトークンへ
        if(tokenNums[index].tokenNum==1 || tokenNums[index].tokenNum==35 || tokenNums[index].tokenNum==37){
            index++;
        }
    }

    //)でなければエラー
    if(tokenNums[index].tokenNum!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index].tokenNum+"配列の添字:"+index);
    }
    index++;

}