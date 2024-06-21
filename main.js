//開発支援プログラムのメイン部分

//ファイルからjavaのコードを読み取る

var form=document.forms.myform;

form.myfile.addEventListener("change",function(e){
    //読み込んだファイル情報を取得
    var fileData=e.target.files[0];
    var reader=new FileReader();
    //ファイル読み込み完了後の処理
    reader.onload=function(){
        //読み込んだデータを表示
        form.myarea.value=reader.result;
    }
});