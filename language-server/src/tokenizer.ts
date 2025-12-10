import { Token, TokenType, KEYWORDS, CONSTANTS } from './types';

export class Tokenizer {
    private input: string;
    private position: number = 0;
    private line: number = 1;
    private column: number = 0;
    private tokens: Token[] = [];

    constructor(input: string) {
        this.input = input;
    }

    tokenize(): Token[] {
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 0;

        while (this.position < this.input.length) {
            this.skipWhitespaceAndComments();
            
            if (this.position >= this.input.length) {
                break;
            }

            const char = this.currentChar();

            // Preprocessor directives (#uses, #include, etc.)
            if (char === '#') {
                this.tokenizeDirective();
            }
            // Numbers
            else if (this.isDigit(char)) {
                this.tokenizeNumber();
            }
            // Strings
            else if (char === '"' || char === "'") {
                this.tokenizeString();
            }
            // Identifiers and Keywords
            else if (this.isLetter(char) || char === '_') {
                this.tokenizeIdentifierOrKeyword();
            }
            // Operators and Delimiters
            else if (this.isOperatorOrDelimiter(char)) {
                this.tokenizeOperatorOrDelimiter();
            }
            // Unknown
            else {
                this.addToken(TokenType.UNKNOWN, char);
                this.advance();
            }
        }

        this.addToken(TokenType.EOF, '');
        return this.tokens;
    }

    private currentChar(): string {
        return this.input[this.position];
    }

    private peek(offset: number = 1): string {
        const pos = this.position + offset;
        if (pos >= this.input.length) {
            return '';
        }
        return this.input[pos];
    }

    private advance(): void {
        if (this.currentChar() === '\n') {
            this.line++;
            this.column = 0;
        } else {
            this.column++;
        }
        this.position++;
    }

    private skipWhitespaceAndComments(): void {
        while (this.position < this.input.length) {
            const char = this.currentChar();

            // Whitespace
            if (this.isWhitespace(char)) {
                this.advance();
                continue;
            }

            // Line comments //
            if (char === '/' && this.peek() === '/') {
                while (this.position < this.input.length && this.currentChar() !== '\n') {
                    this.advance();
                }
                continue;
            }

            // Block comments /* */
            if (char === '/' && this.peek() === '*') {
                this.advance(); // skip /
                this.advance(); // skip *
                while (this.position < this.input.length) {
                    if (this.currentChar() === '*' && this.peek() === '/') {
                        this.advance(); // skip *
                        this.advance(); // skip /
                        break;
                    }
                    this.advance();
                }
                continue;
            }

            break;
        }
    }

    private tokenizeNumber(): void {
        const startLine = this.line;
        const startColumn = this.column;
        let value = '';

        // Check for hex number (0x prefix)
        if (this.currentChar() === '0' && (this.peek() === 'x' || this.peek() === 'X')) {
            value += this.currentChar(); // '0'
            this.advance();
            value += this.currentChar(); // 'x'
            this.advance();
            
            // Read hex digits
            while (this.position < this.input.length && this.isHexDigit(this.currentChar())) {
                value += this.currentChar();
                this.advance();
            }
            
            this.tokens.push({
                type: TokenType.NUMBER,
                value,
                line: startLine,
                column: startColumn
            });
            return;
        }

        // Regular decimal number
        while (this.position < this.input.length && this.isDigit(this.currentChar())) {
            value += this.currentChar();
            this.advance();
        }

        // Handle decimals
        if (this.currentChar() === '.' && this.isDigit(this.peek())) {
            value += this.currentChar();
            this.advance();
            while (this.position < this.input.length && this.isDigit(this.currentChar())) {
                value += this.currentChar();
                this.advance();
            }
        }

        this.tokens.push({
            type: TokenType.NUMBER,
            value,
            line: startLine,
            column: startColumn
        });
    }

    private tokenizeDirective(): void {
        const startLine = this.line;
        const startColumn = this.column;
        let value = '';

        // Consume the #
        this.advance();
        
        // Read the directive name (uses, include, etc.)
        while (this.position < this.input.length && 
               (this.isLetter(this.currentChar()) || this.isDigit(this.currentChar()) || this.currentChar() === '_')) {
            value += this.currentChar();
            this.advance();
        }

        this.tokens.push({
            type: TokenType.DIRECTIVE,
            value,
            line: startLine,
            column: startColumn
        });
    }

    private tokenizeString(): void {
        const startLine = this.line;
        const startColumn = this.column;
        const quote = this.currentChar();
        let value = '';

        this.advance(); // skip opening quote

        while (this.position < this.input.length && this.currentChar() !== quote) {
            if (this.currentChar() === '\\') {
                this.advance();
                if (this.position < this.input.length) {
                    value += this.currentChar();
                    this.advance();
                }
            } else {
                value += this.currentChar();
                this.advance();
            }
        }

        this.advance(); // skip closing quote

        this.tokens.push({
            type: TokenType.STRING,
            value,
            line: startLine,
            column: startColumn
        });
    }

    private tokenizeIdentifierOrKeyword(): void {
        const startLine = this.line;
        const startColumn = this.column;
        let value = '';

        while (this.position < this.input.length && 
               (this.isLetter(this.currentChar()) || this.isDigit(this.currentChar()) || this.currentChar() === '_')) {
            value += this.currentChar();
            this.advance();
        }

        // Check if it's a constant (TRUE, FALSE, NULL) - treat as NUMBER
        if (CONSTANTS.has(value)) {
            this.tokens.push({
                type: TokenType.NUMBER,
                value,
                line: startLine,
                column: startColumn
            });
            return;
        }

        // Check if it's a keyword or identifier
        const type = KEYWORDS.has(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;

        this.tokens.push({
            type,
            value,
            line: startLine,
            column: startColumn
        });
    }

    private tokenizeOperatorOrDelimiter(): void {
        const char = this.currentChar();
        const startLine = this.line;
        const startColumn = this.column;

        // Two-character operators
        if (char === '=' && this.peek() === '=') {
            this.addToken(TokenType.EQUALS, '==');
            this.advance();
            this.advance();
            return;
        }
        if (char === '!' && this.peek() === '=') {
            this.addToken(TokenType.NOT_EQUALS, '!=');
            this.advance();
            this.advance();
            return;
        }
        if (char === '&' && this.peek() === '&') {
            this.addToken(TokenType.AND, '&&');
            this.advance();
            this.advance();
            return;
        }
        if (char === '|' && this.peek() === '|') {
            this.addToken(TokenType.OR, '||');
            this.advance();
            this.advance();
            return;
        }
        if (char === '<' && this.peek() === '<') {
            this.addToken(TokenType.LEFT_SHIFT, '<<');
            this.advance();
            this.advance();
            return;
        }
        if (char === '>' && this.peek() === '>') {
            this.addToken(TokenType.RIGHT_SHIFT, '>>');
            this.advance();
            this.advance();
            return;
        }

        // Single-character operators and delimiters
        switch (char) {
            case '=':
                this.addToken(TokenType.ASSIGN, '=');
                break;
            case '+':
                this.addToken(TokenType.PLUS, '+');
                break;
            case '-':
                this.addToken(TokenType.MINUS, '-');
                break;
            case '*':
                this.addToken(TokenType.MULTIPLY, '*');
                break;
            case '/':
                this.addToken(TokenType.DIVIDE, '/');
                break;
            case '<':
                this.addToken(TokenType.LESS_THAN, '<');
                break;
            case '>':
                this.addToken(TokenType.GREATER_THAN, '>');
                break;
            case '!':
                this.addToken(TokenType.NOT, '!');
                break;
            case '&':
                this.addToken(TokenType.BIT_AND, '&');
                break;
            case '|':
                this.addToken(TokenType.BIT_OR, '|');
                break;
            case '^':
                this.addToken(TokenType.BIT_XOR, '^');
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON, ';');
                break;
            case ',':
                this.addToken(TokenType.COMMA, ',');
                break;
            case '.':
                this.addToken(TokenType.DOT, '.');
                break;
            case ':':
                this.addToken(TokenType.COLON, ':');
                break;
            case '?':
                this.addToken(TokenType.QUESTION, '?');
                break;
            case '(':
                this.addToken(TokenType.LPAREN, '(');
                break;
            case ')':
                this.addToken(TokenType.RPAREN, ')');
                break;
            case '{':
                this.addToken(TokenType.LBRACE, '{');
                break;
            case '}':
                this.addToken(TokenType.RBRACE, '}');
                break;
            case '[':
                this.addToken(TokenType.LBRACKET, '[');
                break;
            case ']':
                this.addToken(TokenType.RBRACKET, ']');
                break;
            default:
                this.addToken(TokenType.UNKNOWN, char);
        }

        this.advance();
    }

    private addToken(type: TokenType, value: string): void {
        this.tokens.push({
            type,
            value,
            line: this.line,
            column: this.column
        });
    }

    private isWhitespace(char: string): boolean {
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
    }

    private isDigit(char: string): boolean {
        return char >= '0' && char <= '9';
    }

    private isHexDigit(char: string): boolean {
        return (char >= '0' && char <= '9') || 
               (char >= 'a' && char <= 'f') || 
               (char >= 'A' && char <= 'F');
    }

    private isLetter(char: string): boolean {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    private isOperatorOrDelimiter(char: string): boolean {
        return '=+-*/<>!&|^;,.:?(){}[]'.includes(char);
    }
}
