import org.eclipse.jdt.core.ToolFactory;
import org.eclipse.jdt.core.compiler.IScanner;
import org.eclipse.jdt.core.compiler.ITerminalSymbols;
import org.eclipse.jdt.core.compiler.InvalidInputException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
public class JavaTokenizer {
    /**
     * プログラムのエントリポイント
     */
    public static void main(String[] args) throws IOException, InvalidInputException {
        Path sourcePath = Paths.get("JavaTokenizer.java");
        String source = new String(Files.readAllBytes(sourcePath));
        IScanner scanner = ToolFactory.createScanner(true, false, true, "1.9");
        scanner.setSource(source.toCharArray());
        System.out.println("token|start| end |line | ");
        int tokenType;
        while ((tokenType = scanner.getNextToken()) != ITerminalSymbols.TokenNameEOF) {
            int start = scanner.getCurrentTokenStartPosition();
            int end = scanner.getCurrentTokenEndPosition();
            int line = scanner.getLineNumber(start);
            String token = new String(scanner.getCurrentTokenSource());
            String tokenDesc = String.format("%4d |%4d |%4d |%4d | %s", tokenType,
                    start, end, line, token);
            System.out.println(tokenDesc);
        }
    }
}