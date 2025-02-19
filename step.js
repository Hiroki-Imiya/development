/*ステップ実行の際にJavaScriptのコードで実行する関数をまとめたファイル*/

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

//ステップ実行の際にスコープの変更にともなう変数を削除する関数
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

//ステップ実行の際に現在実行している行を更新する関数
//引数：行数
//返り値：なし
function saveLine(line){
	currentRow=line;
	return ;
}

//AceEditorの指定した行の色をCSSのace_active_lineで指定した色に変更する関数
//引数：なし
//返り値：なし
function changeColor(){

    //markerが存在する場合は削除
    if(marker){
        editor.getSession().removeMarker(marker);
    }

    // Rangeクラスを使用して範囲を作成
    const Range = ace.require("ace/range").Range;
    const range = new Range(currentRow-1, 0, currentRow, 0);
	marker = editor.getSession().addMarker(range,"ace_active_line","background");
	editor.scrollToLine(currentRow, true, true);
}

//ジェネレーター関数でマーカーや表を更新する関数
function update(){
    //マーカーの更新
    changeColor();

    // 変数を表で表示
    const table = document.getElementById('variable_table');
    let tr = "<tr><th>型</th><th>変数名</th><th>値</th><th>スコープ</th></tr>";

    for (let i = 0; i < variables.length; i++) {
        tr += "<tr><td>" + variables[i].Type + "</td><td>" + variables[i].Name + "</td><td>"+variables[i].Value+"</td><td>"+variables[i].Scope+"</td></tr>";
    }


    table.innerHTML = tr;
}
