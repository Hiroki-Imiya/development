import java.util.ArrayList;

public class Test{
    public static void main(String[] args){
        int cnt=0;
        
        while(cnt<10){
            cnt=cnt+3;
            cnt++;
        }
        
        for(int i=0;i<cnt;i=i+2){
            while(i+cnt<40){
                System.out.println(i+cnt);
                cnt++;
            }
        }
    }
}