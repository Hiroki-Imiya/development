//このJavaScriptは、JavaのコードをJavaScriptに変換した内容を確認するためのものです。

/*class Test {
	static *main (args ){
	let a =0;
	yield;
	while(a < 10){
	console.log("a");
	a++;
	}
	yield;
	console.log(a);
	let i =0;
	for(i=0;i > 29;i++){
	for(a=0;a > i+1;a++){
	console.log(a);
	}
	}
	}
	}*/

	/*let JavaScriptCode = "class Test {\n";
	JavaScriptCode += "\tstatic *main (args ){\n";
	JavaScriptCode += "\tlet a =0;\n";
	JavaScriptCode += "\tyield;\n";
	JavaScriptCode += "\twhile(a < 10){\n";
	JavaScriptCode += "\tconsole.log(\"a\");\n";
	JavaScriptCode += "\ta++;\n";
	JavaScriptCode += "\t}\n";
	JavaScriptCode += "\tyield;\n";
	JavaScriptCode += "\tconsole.log(a);\n";
	JavaScriptCode += "\tlet i =0;\n";
	JavaScriptCode += "\tfor(i=0;i > 29;i++){\n";
	JavaScriptCode += "\tfor(a=0;a > i+1;a++){\n";
	JavaScriptCode += "\tconsole.log(a);\n";
	JavaScriptCode += "\t}\n";
	JavaScriptCode += "\t}\n";
	JavaScriptCode += "\t}\n";
	JavaScriptCode += "\t}\n";


	const func = new Function(JavaScriptCode+"return Test;");
	const TestClass=func();
	
	const run=document.getElementById('run');
	//ジェネレータ関数であるmainを実行
	const gen=TestClass.main();

	//ボタンを押したときの処理
	run.addEventListener('click',function(){
		//ジェネレータ関数の実行
		gen.next();
	});*/



	class Test{
		static a=1;

		ta=4;

		static main(){
			let g=0;
			console.log(this.a);
			console.log(g);
			console.log(Test.tmp);

			const tmpInstance=new tmp();
			tmpInstance.tmp_method();
		}
	}

	class tmp{
		tmp_method(){
			console.log("tmp_method");
		}
	}


	//Testを継承したnewTestクラス
	class newTest extends Test{
		static main(){
			super.main();
			console.log("newTest");
		}
	}

	let tre=new Test();
	console.log("ts"+tre.ta);
	Test.main();
	newTest.main();

	for(let i=0;i<0;i++){
		console.log("for");
	}


	let tmpString = "Hello %s World %d";

	//分割した書式文を保存する変数
    let formatStrings = [];

    //書式文を型を指定する指定子で分割
    for(let i=0;i<tmpString.length;i++){
        //%があればその前までをJavaScriptに追加
        if(tmpString[i]=="%"){
            formatStrings.push("\""+tmpString.substring(0,i)+"\"");
            //JavaScriptに%を追加
            formatStrings.push("%"+tmpString[i+1]);
            //%の後ろを保存
            tmpString = tmpString.substring(i+1,tmpString.length);
            i=0;
        }
    }

    console.log(formatStrings);
