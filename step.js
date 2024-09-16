//ステップ実行の際に新たに変数を追加する関数
//引数：変数名、変数の型、変数の値，スコープ
//返り値：なし
function addVariable(variableName, type, value, d_scope){
	variables.push({Name:variableName, Type:type, Value:value,Scope:d_scope});
}


//ステップ実行の際に変数の値を変更する関数
//引数：変数名、変更する値
//返り値：なし
function changeVariableValue(variableName, value){
	for(let i=0; i<variables.length; i++){
		if(variables[i].Name==variableName){
			variables[i].Value=value;
			break;
		}else if(i==variables.length-1){
            throw new Error("変数が見つかりません.トークン名:"+variableName+"配列の添字:"+index);
        }
	}
}

//ステップ実行の際にスコープの変更にともう変数を削除する関数
//引数：スコープ
//返り値：なし
function deleteVariable(d_scope){
	for(let i=0; i<variables.length; i++){
		if(variables[i].Scope==d_scope){
			variables.splice(i,1);
			i--;
		}
	}
}

//ステップ実行の際に変数表の最後のスコープを取得する関数
//引数：なし
//返り値：スコープ
function getScope(){
	return variables[variables.length-1].Scope;
}