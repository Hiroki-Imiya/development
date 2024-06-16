const fs = require('fs');

//開発支援プログラムのメイン部分

//ファイルからjavaのコードを読み取る
// Read the file contents
fs.readFile('/tmp.java', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Process the Java code
    // You can perform any operations on the code here
    console.log(data);
});