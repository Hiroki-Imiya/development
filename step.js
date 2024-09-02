//ステップ実行の際に新たに変数を追加する関数
//引数：変数名、変数の型、変数の値
//返り値：なし
function addVariable(variableName, type, value){
	variables.push({Name:variableName, Type:type, Value:value});
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