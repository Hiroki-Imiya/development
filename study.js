// Description: JavaScriptの勉強をするためのファイルです。


//htmlのidがresult
const result = document.getElementById('result');
/*let a=[1,2,3];
let b= new Array(1,2,3);

let str = "";

a.pop();
b.shift();

for(let i=0; i<a.length; i++){
    str+="<div>";
    str += "a["+i+"] = " + a[i] + "</div>";
}

for(let i=0; i<b.length; i++){
    str+="<div>";
    str += "b["+i+"] = " + b[i] + "</div>";
}

result.innerHTML = str;*/
//ここまでは配列の勉強

/*
//Userクラスのインスタンスを生成
let user = new User("taro", "1234");
let user2 = new User("jiro", "5678");

//loginメソッドを呼び出す
user.login();
user2.login();

//パスワードを変更する
user.changePassword("5678");
user2.changePassword("1234");

//loginメソッドを呼び出す
user.login();
user2.login();

//Userクラスのcountプロパティにアクセス
console.log(User.count);

//UserクラスのgetCountメソッドを呼び出す
console.log(User.getCount());

let admin = new Admin("saburo", "0000", "super");
let admin2= new Admin("shiro","9999");

admin.login();
admin2.login();

console.log(Admin.count);
console.log(Admin.getCount());

console.log(admin.userName);

admin.userName = "goro";

console.log(admin.userName);

console.log(admin.password);

admin.password = "1111";

console.log(admin.password);

console.log(admin.role);

admin.role = "normal";

console.log(admin.role);

//ここまでがUserクラスのインスタンスを生成して、メソッドを呼び出すところ
*/

//ここからはオブジェクトの勉強
let tokens ={
    tokenNum : 3,
    tokenValue : "int"
}

delete tokens.tokenNum;

result.innerHTML = tokens.tokenNum + "<br>" + tokens.tokenValue;

result.innerHTML += "<br>";

//result.innerHTML += tokens["tokenNum"] + "<br>" + tokens["tokenValue"];