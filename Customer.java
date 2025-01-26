public class Customer{
    public int money=1000;
    public String name="Tanaka";

    public void earn(int price){
        money += price;
    }

    public void pay(int price){
        money -= price;
    }
}

public class Test{
    public static void main(String[] args){
        Customer customer = new Customer();
        customer.pay(200);   
    }
}