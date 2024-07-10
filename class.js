class User{

	//静的プロパティ
	static count = 0;

	//静的メソッド
	static getCount(){
		return User.count;
	}

	constructor(userName, password){
		this.userName = userName;
		this.password = password;
	}

	login(){
		
		const result = document.getElementById('result');
		//resultの中身を読み取る
		let str = result.innerHTML;
		str += "<div>";
		str += "userName = " + this.userName + "</div>";
		str += "<div>";
		str += "password = " + this.password + "</div>";
		result.innerHTML = str;
		
	}

	//パスワードを変更するメソッド
	changePassword(newPassword){
		this.password = newPassword;
	}

	//getter
	get userName(){
		return this._userName;
	}

	//setter
	set userName(value){
		this._userName = value;
	}

	//getter
	get password(){
		return this._password;
	}

	//setter
	set password(value){
		this._password = value;
	}
}

//Userクラスを継承したAdminクラス
class Admin extends User{
	constructor(userName, password, role){
		super(userName, password);
		this.role = role;
	}

	//Userクラスのloginメソッドをオーバーライド
	login(){
		super.login();
		const result = document.getElementById('result');
		let str = result.innerHTML;
		str += "<div>";
		str += "role = " + this.role + "</div>";
		result.innerHTML = str;
	}

	//getter
	get role(){
		return this._role;
	}

	//setter
	set role(value){
		this._role = value;
	}
}