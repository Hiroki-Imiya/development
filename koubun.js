//構文解析を行う関数
function syntaxAnalysis(){
    //トークンの数だけ繰り返す
    index=0;
    while(index<tokenNums.length){
        //プログラムの関数
        program();
        index++;
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
    }
}

//import文の関数
function importStatement(){

    console.log("importStatement" + tokenNums[index]);
    //識別子でなければエラー
    if(tokenNums[index]!=1){
        throw new Error("importの後に識別子がありません");
    }
    index++;

    //トークンが.の間繰り返す
    while(tokenNums[index]==64){
        index++;
        //識別子またはArrayListでなければエラー
        if(tokenNums[index]!=1 && tokenNums[index]!=34){
            throw new Error("import文の.の後に識別子またはArrayListがありません");
        }
        index++;
    }

    //;でなければエラー
    if(tokenNums[index]!=69){
        throw new Error("import文が;で終わっていません");
    }

}

//クラス定義の関数
function classDefinition(){

    console.log("classDefinition" + tokenNums[index]);
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

    //}が来るまで繰り返す
    while(tokenNums[index]!=58){
        //アクセス修飾子がある場合次のトークンへ
        if(tokenNums[index]==14 || tokenNums[index]==15){
            index++;
        }

        //他の修飾子がある場合次のトークンへ
        if(tokenNums[index]==17){
            index++;
        }

        if(tokenNums[index]==40){
            index++;
        }else{
            //型の関数
            type();
        }

        //識別子でなければエラー
        if(tokenNums[index]!=1){
            throw new Error("関数名がありません");
        }

        index++;

        //(でなければフィールド宣言の関数へ
        if(tokenNums[index]!=55){
            fieldDeclaration();

            //;でなければエラー
            if(tokenNums[index]!=69){
                throw new Error("フィールド宣言または変数宣言が;で終わっていません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

        //型であれば変数宣言の関数へ
        }else {
            index++;
            fieldDeclaration();
        }

        //)でなければエラー
        if(tokenNums[index]!=56){
            throw new Error(")がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
        }
        index++;

        //;でなければ関数宣言の関数へ
        if(tokenNums[index]!=69){
            functionDeclaration();
        }else {
            //;であれば関数定義として次のトークンへ
            index++;
        }

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("クラス定義が}で終わっていません");
        }
    }
    
}

//型の関数
function type(){

    console.log("type" + tokenNums[index]);
    //型を格納しておく変数
    let variable_type;

    //型でなければエラー
    if(tokenNums[index]!=25 && tokenNums[index]!=26 && tokenNums[index]!=27 && tokenNums[index]!=28 && tokenNums[index]!=29 && tokenNums[index]!=30 && tokenNums[index]!=31 && tokenNums[index]!=32 && tokenNums[index]!=33 && tokenNums[index]!=34){
        throw new Error("型がありません");
    }
    //型を格納
    variable_type=tokenNums[index];

    index++;

    //[があれば次のトークンへ
    if(tokenNums[index]==59){
        index++;
        if(tokenNums[index]!=60){
            throw new Error("]で終わっていません");
        }
        index++;
    }

    //型がArrayListの場合は<>がある
    if(tokenNums[index]==61){
        index++;
        type();
        if(tokenNums[index]!=62){
            throw new Error(">で終わっていません");
        }
        index++;
    }

    //型を返す(初期化の際に使用する)
    return variable_type;
}

//フィールド宣言(変数宣言)の関数
function fieldDeclaration(){

    console.log("fieldDeclaration" + tokenNums[index]);
    //型の関数
    let variable_type=type();

    //宣言子の並びの関数
    declaratorList(variable_type);
    
}

//宣言子の並びの関数(引数は変数の型)
function declaratorList(variable_type){

    console.log("declaratorList" + tokenNums[index]);

    //識別子でなければエラー
    if(tokenNums[index]!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    index++;

    console.log(tokenNums[index]);
    //イコールがあれば次のトークンへ
    if(tokenNums[index]==70){
        index++;

        console.log(tokenNums[index]);
        console.log(variable_type);
        //型がintの場合
        if(variable_type==25){
            //整数でなければエラー
            if(tokenNums[index]!=35){
                throw new Error("int型に整数がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

            //演算子である間繰り返す
            while(tokenNums[index]==50 || tokenNums[index]==51 || tokenNums[index]==52 || tokenNums[index]==53 || tokenNums[index]==54){
                index++;
                //整数でなければエラー
                if(tokenNums[index]!=35){
                    throw new Error("int型に整数以外の計算をしようとしています.トークン名:"+tokenNums[index]+"配列の添字:"+index);
                }
                index++;
            }
        //型がbyteの場合
        }else if(variable_type==26){    
            //整数でなければエラー
            if(tokenNums[index]!=35){
                throw new Error("byte型に整数がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;
            
            //演算子である間繰り返す
            while(tokenNums[index]==50 || tokenNums[index]==51 || tokenNums[index]==52 || tokenNums[index]==53 || tokenNums[index]==54){
                index++;
                //整数でなければエラー
                if(tokenNums[index]!=35){
                    throw new Error("byte型に整数以外の計算をしようとしています.トークン名:"+tokenNums[index]+"配列の添字:"+index);
                }
                index++;
            }

        //型がshortの場合
        }else if(variable_type==27){    
            //整数でなければエラー
            if(tokenNums[index]!=35){
                throw new Error("short型に整数がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

            //演算子である間繰り返す
            while(tokenNums[index]==50 || tokenNums[index]==51 || tokenNums[index]==52 || tokenNums[index]==53 || tokenNums[index]==54){
                index++;
                //整数でなければエラー
                if(tokenNums[index]!=35){
                    throw new Error("short型に整数以外の計算をしようとしています.トークン名:"+tokenNums[index]+"配列の添字:"+index);
                }
                index++;
            }

        //型がlongの場合
        }else if(variable_type==28){    
            //整数でなければエラー
            if(tokenNums[index]!=35){
                throw new Error("long型に整数がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

            //演算子である間繰り返す
            while(tokenNums[index]==50 || tokenNums[index]==51 || tokenNums[index]==52 || tokenNums[index]==53 || tokenNums[index]==54){
                index++;
                //整数でなければエラー
                if(tokenNums[index]!=35){
                    throw new Error("long型に整数以外の計算をしようとしています.トークン名:"+tokenNums[index]+"配列の添字:"+index);
                }
                index++;
            }

        //型がfloatの場合
        }else if(variable_type==29){
            //実数でなければエラー
            if(tokenNums[index]!=36){
                throw new Error("float型に実数がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

            //演算子である間繰り返す
            while(tokenNums[index]==50 || tokenNums[index]==51 || tokenNums[index]==52 || tokenNums[index]==53 || tokenNums[index]==54){
                index++;
                //実数でなければエラー
                if(tokenNums[index]!=36){
                    throw new Error("float型に実数以外の計算をしようとしています.トークン名:"+tokenNums[index]+"配列の添字:"+index);
                }
                index++;
            }

        //型がdoubleの場合
        }else if(variable_type==30){
            //実数でなければエラー
            if(tokenNums[index]!=36){
                throw new Error("double型に実数がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

            //演算子である間繰り返す
            while(tokenNums[index]==50 || tokenNums[index]==51 || tokenNums[index]==52 || tokenNums[index]==53 || tokenNums[index]==54){
                index++;
                //実数でなければエラー
                if(tokenNums[index]!=36){
                    throw new Error("double型に実数以外の計算をしようとしています.トークン名:"+tokenNums[index]+"配列の添字:"+index);
                }
                index++;
            }

        //型がbooleanの場合
        }else if(variable_type==31){
            //trueまたはfalseでなければエラー
            if(tokenNums[index]!=38 && tokenNums[index]!=39){
                throw new Error("boolean型にtrueまたはfalseがありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;
        
        //型がcharの場合
        }else if(variable_type==32){
            //文字でなければエラー
            if(tokenNums[index]!=41){
                throw new Error("char型に文字がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

        //型がStringの場合
        }else if(variable_type==33){
            //文字列でなければエラー
            if(tokenNums[index]!=37){
                throw new Error("String型に文字列がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

            //プラスがあれば文字列の連結
            if(tokenNums[index]==50){
                index++;
                //文字列でなければエラー
                if(tokenNums[index]!=37){
                    throw new Error("String型ではないものが連結されています.トークン名:"+tokenNums[index]+"配列の添字:"+index);
                }
            }

        //型がArrayListの場合
        }else if(variable_type==34){
            //newでなければエラー
            if(tokenNums[index]!=13){
                throw new Error("ArrayList型にnewがありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }

            index++;

            //ArrayListでなければエラー
            if(tokenNums[index]!=34){
                throw new Error("ArrayList型にArrayListがありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }

            index++;

            //<でなければエラー
            if(tokenNums[index]!=61){
                throw new Error("ArrayList型に<がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }

            index++;

            //型の関数
            type();

            //>でなければエラー
            if(tokenNums[index]!=62){
                throw new Error("ArrayList型に>がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }

            index++;

            //(でなければエラー
            if(tokenNums[index]!=55){
                throw new Error("ArrayList型に(がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;

            //整数または識別子であれば次のトークンへ
            if(tokenNums[index]==35 || tokenNums[index]==1){
                index++;
            }

            //)でなければエラー
            if(tokenNums[index]!=56){
                throw new Error("ArrayList型に)がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }


        }else {
            throw new Error("型がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
        }

    }
    //,があればもう一度宣言子の並びの関数へ
    if(tokenNums[index]==63){
        index++;
        declaratorList();
    }

    return;
}

//関数宣言の関数
function functionDeclaration(){

    console.log("functionDeclaration" + tokenNums[index]);
    //{でなければエラー
    if(tokenNums[index]!=57){
        throw new Error("{がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    index++;

    //}が来るまで繰り返す
    while(tokenNums[index]!=58){

        //型の場合は変数宣言の関数へ
        if(tokenNums[index]==25 || tokenNums[index]==26 || tokenNums[index]==27 || tokenNums[index]==28 || tokenNums[index]==29 || tokenNums[index]==30 || tokenNums[index]==31 || tokenNums[index]==32 || tokenNums[index]==33 || tokenNums[index]==34){
            fieldDeclaration();
            //;でなければエラー
            if(tokenNums[index]!=69){
                throw new Error(";がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
        
        //そうでなければ文の関数へ
        }else{
            statement();
        }

        index++;

        //もし途中でindexがtokenNumsの長さを超えた場合はエラー
        if(index>=tokenNums.length){
            throw new Error("関数が}で終わっていません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
        }
    }
}

//文の関数
function statement(){

    console.log("statement" + tokenNums[index]);
    //トークンによって処理を分岐
    switch (tokenNums[index]){
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
            if(tokenNums[index]!=69){
                throw new Error(";がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            break;
        //breakの場合
        case 12:
            index++;
            breakStatement();
            //;でなければエラー
            if(tokenNums[index]!=69){
                throw new Error(";がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            break;
        //識別子の場合
        case 1:
            index++;
            identifierStatement();
            //;でなければエラー
            if(tokenNums[index]!=69){
                throw new Error(";がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            break;
        default:
            throw new Error("文エラー.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            break;
    }
}

//if文の関数
function ifStatement(){

    console.log("ifStatement" + tokenNums[index]);
    //(でなければエラー
    if(tokenNums[index]!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //比較文の関数
    comparisonStatement();

    //)でなければエラー
    if(tokenNums[index]!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //{でなければエラー
    if(tokenNums[index]!=57){
        throw new Error("{がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    index++;

    //文の関数
    statement();

    index++;

    //}でなければエラー
    if(tokenNums[index]!=58){
        throw new Error("}がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    index++;

    //elseがある間繰り返す
    while(tokenNums[index]==8){
        index++;
        
        //ifの場合
        if(tokenNums[index]==7){
            index++;
            ifStatement();

        //{の場合
        }else if(tokenNums[index]==57){
            index++;
            statement();

            //}でなければエラー
            if(tokenNums[index]!=58){
                throw new Error("}がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
            }
            index++;
        }

    }
}

//比較文の関数
function comparisonStatement(){

    console.log("comparisonStatement" + tokenNums[index]);
    //識別子でなければエラー
    if(tokenNums[index]!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //比較演算子でなければエラー
    if(tokenNums[index]!=61 && tokenNums[index]!=62 && tokenNums[index]!=69){
        throw new Error("比較演算子がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    //比較演算子が=の場合
    if(tokenNums[index]==69){
        index++;
        //=でなければエラー
        if(tokenNums[index]!=70){
            throw new Error("==でない比較演算子があります.トークン名:"+tokenNums[index]+"配列の添字:"+index);
        }
    }
    index++;

    //識別子または整数でなければエラー
    if(tokenNums[index]!=1 && tokenNums[index]!=35){
        throw new Error("識別子または整数がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //||または&&がある間繰り返す
    while((tokenNums[index]==65 && tokenNums[index+1]==65) || (tokenNums[index]==66 && tokenNums[index+1]==66)){
        index++;
        index++;
        //識別子でなければエラー
        if(tokenNums[index]!=1){
            throw new Error("識別子がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
        }
        index++;
    }

}

//while文の関数
function whileStatement(){

    console.log("whileStatement" + tokenNums[index]);
    //(でなければエラー
    if(tokenNums[index]!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //比較文の関数
    comparisonStatement();

    //)でなければエラー
    if(tokenNums[index]!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //{でなければエラー
    if(tokenNums[index]!=57){
        throw new Error("{がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    index++;

    //文の関数
    statement();

    index++;    

    //}でなければエラー
    if(tokenNums[index]!=58){
        throw new Error("}がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    index++;
}

//for文の関数
function forStatement(){

    console.log("forStatement" + tokenNums[index]);
    //(でなければエラー
    if(tokenNums[index]!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //変数宣言の関数
    fieldDeclaration();

    //;でなければエラー
    if(tokenNums[index]!=69){
        throw new Error(";がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //比較文の関数
    comparisonStatement();

    //;でなければエラー
    if(tokenNums[index]!=69){
        throw new Error(";がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //演算子の関数
    operatorStatement();

    //)でなければエラー
    if(tokenNums[index]!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //{でなければエラー
    if(tokenNums[index]!=57){
        throw new Error("{がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    index++;

    //文の関数
    statement();

    index++;

    //}でなければエラー
    if(tokenNums[index]!=58){
        throw new Error("}がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }

    index++;
}

//return文の関数
function returnStatement(){

    console.log("returnStatement" + tokenNums[index]);
    //識別子でなければエラー
    if(tokenNums[index]!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //;でなければエラー
    if(tokenNums[index]!=69){
        throw new Error(";がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;
}

//break文の関数
function breakStatement(){

    console.log("breakStatement" + tokenNums[index]);
    //;でなければエラー
    if(tokenNums[index]!=69){
        throw new Error(";がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;
}

//識別子の文の関数
function identifierStatement(){

    console.log("identifierStatement" + tokenNums[index]);
    //.がある間繰り返す
    while(tokenNums[index]==64){
        index++;

        //printの場合
        if(tokenNums[index]==2){
            index++;
            printStatement();

            //while文を抜ける
            break;
        
        //printlnの場合
        }else if(tokenNums[index]==3){
            index++;
            printlnStatement();

            //while文を抜ける
            break;

        //printfの場合
        }else if(tokenNums[index]==4){
            index++;
            printfStatement();

            //while文を抜ける
            break;
        }

        //識別子でなければエラー
        if(tokenNums[index]!=1){
            throw new Error("識別子がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
        }
        index++;
    }

    //(であれば関数呼び出しの関数
    if(tokenNums[index]==55){
        index++;
        functionCallStatement();
    }


    //イコールがあれば次のトークンへ
    if(tokenNums[index]==70){
        index++;

        //演算子の関数
        operatorStatement();
    }

}

//print文の関数
function printStatement(){

    console.log("printStatement" + tokenNums[index]);
    //(でなければエラー
    if(tokenNums[index]!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //識別子または文字列であれば次のトークンへ
    if(tokenNums[index]==1 || tokenNums[index]==37){
        index++;
    }

    //)でなければエラー
    if(tokenNums[index]!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

}

//println文の関数
function printlnStatement(){

    console.log("printlnStatement" + tokenNums[index]);
    //(でなければエラー
    if(tokenNums[index]!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //識別子または文字列であれば次のトークンへ
    if(tokenNums[index]==1 || tokenNums[index]==37){
        index++;
    }

    //)でなければエラー
    if(tokenNums[index]!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

}

//printf文の関数
function printfStatement(){

    console.log("printfStatement" + tokenNums[index]);
    //(でなければエラー
    if(tokenNums[index]!=55){
        throw new Error("(がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //文字列であれば次のトークンへ
    if(tokenNums[index]==37){
        index++;
    }

    //,がある間繰り返す
    while(tokenNums[index]==63){
        index++;

        //識別子または文字列であれば次のトークンへ
        if(tokenNums[index]==1 || tokenNums[index]==37){
            index++;
        }
    }

    //)でなければエラー
    if(tokenNums[index]!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

}

//演算子の関数
function operatorStatement(){

    console.log("operatorStatement" + tokenNums[index]);
    //識別子または整数であれば次のトークンへ
    if(tokenNums[index]==1 || tokenNums[index]==35){
        index++;
    }

    //演算子である間繰り返す
    while(tokenNums[index]==50 || tokenNums[index]==51 || tokenNums[index]==52 || tokenNums[index]==53 || tokenNums[index]==54){
        //インクリメント用の変数
        let increment_index=tokenNums[index];
        index++;
        //識別子または整数であれば次のトークンへ
        if(tokenNums[index]==1 || tokenNums[index]==35){
            index++;
        }

        //インクリメントの場合
        if((increment_index==50 && tokenNums[index]==50) || (increment_index==51 && tokenNums[index]==51)){
            index++;
            break;
        }

    }

}

//関数呼び出しの関数
function functionCallStatement(){

    console.log("functionCallStatement" + tokenNums[index]);
    //識別子または整数または文字列でなければエラー
    if(tokenNums[index]!=1){
        throw new Error("識別子がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

    //,がある間繰り返す
    while(tokenNums[index]==63){
        index++;

        //識別子または整数または文字列であれば次のトークンへ
        if(tokenNums[index]==1 || tokenNums[index]==35 || tokenNums[index]==37){
            index++;
        }
    }

    //)でなければエラー
    if(tokenNums[index]!=56){
        throw new Error(")がありません.トークン名:"+tokenNums[index]+"配列の添字:"+index);
    }
    index++;

}