class Customer {
	my_money =100;
	*pay (money ){
	addVariable("money","int",0,1);
	changeVariableValue("money",money);
	saveLine(3);
	yield;
	this.my_money=money;
	changeVariableValue("my_money",this.my_money);
	message.value+="\n";
	saveLine(4);
	yield;
	deleteVariable(1);
	yield;
	}
	}
	class newCustomer extends Customer {
	*earn (money ){
	addVariable("money","int",0,2);
	changeVariableValue("money",money);
	saveLine(9);
	yield;
	this.my_money=money;
	changeVariableValue("my_money",this.my_money);
	message.value+="\n";
	saveLine(10);
	yield;
	deleteVariable(2);
	yield;
	}
	}
	class Test {
	static *main (args ){
	addVariable("args","String[]",[],3);
	changeVariableValue("args",args);
	saveLine(15);
	yield;
	let a =20;
	addVariable("a","int",0,3);
	changeVariableValue("a",a);
	saveLine(16);
	yield;
	let human =new newCustomer();
	addVariable("human","newCustomer",0,3);
	changeVariableValue("human",human);
	saveLine(17);
	yield;
	let tmp_earn=human.earn(a);
	while(!tmp_earn.next().done){
	yield;
	}
	;
	message.value+="\n";
	saveLine(18);
	yield;
	let tmp_pay=human.pay(a);
	while(!tmp_pay.next().done){
	yield;
	}
	;
	message.value+="\n";
	saveLine(19);
	yield;
	deleteVariable(3);
	yield;
	}
	}
	let tmp_filed_claass0 = new Customer();
	let tmp_filed_claass1 = new newCustomer();
	let tmp_filed_claass2 = new Test();
	addVariable("my_money","int",0,0);
	changeVariableValue("my_money",tmp_filed_claass0.my_money);