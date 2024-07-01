let a=[1,2,3];
let b= new Array(1,2,3);

//htmlのidがresultの要素にaとbの内容を表示する
const result = document.getElementById('result');

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

result.innerHTML = str;
