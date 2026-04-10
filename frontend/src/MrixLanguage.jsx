export function registerMrixLanguage(monaco) {
    monaco.languages.register({ id: 'mrix' });

    monaco.languages.setMonarchTokensProvider('mrix', {
        keywords: [
            'if', 'else', 'while', 'for', 'funct', 'return', 'print', 
            'import', 'continue', 'break', 'and', 'or', 'not'
        ],

        operators: [
            '=', '+=', '-=', '*=', '/=', '%=',
            '==', '!=', '>', '<', '>=', '<=',
            '+', '-', '*', '/', '%', 
            '.*', '.+', '.-', './',
            "'"
        ],

        builtins: [
            'eye', 'zeros', 'ones', 'inv', 'abs', 'sqrt', 'sin', 'cos', 
            'tan', 'log', 'ln', 'pow', 'exp', 'floor', 'ceil', 'round',
            'sum', 'min', 'max', 'mean', 'size', 'rows', 'cols', 'len',
            'contains', 'at', 'type', 'int', 'float', 'str', 'bool',
            'f_read', 'f_readline', 'f_lines', 'f_write', 'f_append'
        ],

        tokenizer: {
            root: [
                [/[a-zA-Z_]\w*/, {
                    cases: {
                        '@keywords': 'keyword',
                        '@builtins': 'predefined',
                        'true|false': 'constant.boolean',
                        '@default': 'identifier'
                    }
                }],

                { include: '@whitespace' },

                [/\d+(\.\d+)?/, 'number'],

                [/"/, 'string', '@string'],

                [/[+\-*\/=%<>!&|']+(\.[+\-*\/])?/, 'operator'],

                [/[{}()\[\]]/, '@brackets'],
                [/[;,]/, 'delimiter'],
            ],

            string: [
                [/[^"]+/, 'string'],
                [/"/, 'string', '@pop'],
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\/.*$/, 'comment'],
            ],
        }
    });

    monaco.languages.registerCompletionItemProvider('mrix', {
        provideCompletionItems: (model, position) => {
            const suggestions = [
                // Keywords & Flow Control
                { label: 'funct', detail: 'Function definition', insertText: 'funct ${1:name}(${2:args}) {\n\t$0\n}', kind: monaco.languages.CompletionItemKind.Keyword },
                { label: 'for', detail: 'Range loop', insertText: 'for ${1:i} = ${2:start}:${3:end} {\n\t$0\n}', kind: monaco.languages.CompletionItemKind.Keyword },
                { label: 'if', detail: 'Conditional statement', insertText: 'if (${1:condition}) {\n\t$0\n}', kind: monaco.languages.CompletionItemKind.Keyword },
                { label: 'import', detail: 'Import .mrix file', insertText: 'import "${1:file}.mrix";', kind: monaco.languages.CompletionItemKind.Keyword },
                { label: 'while', detail: 'While statement', insertText: 'while (${1:condition}) {\n\t$0\n}', kind: monaco.languages.CompletionItemKind.Keyword },

                // Math & Statistics
                { label: 'inv', detail: 'inv(A) -> MATRIX', documentation: 'Returns the inverse of matrix A.', insertText: 'inv(${1:A})' },
                { label: 'abs', detail: 'abs(x) -> NUM/MAT', documentation: 'Returns absolute value.', insertText: 'abs(${1:x})' },
                { label: 'sqrt', detail: 'sqrt(x) -> NUM/MAT', documentation: 'Returns square root.', insertText: 'sqrt(${1:x})' },
                { label: 'sin', detail: 'sin(x) -> FLOAT', documentation: 'Sine (radians).', insertText: 'sin(${1:x})' },
                { label: 'cos', detail: 'cos(x) -> FLOAT', documentation: 'Cosine (radians).', insertText: 'cos(${1:x})' },
                { label: 'tan', detail: 'tan(x) -> FLOAT', documentation: 'Tangent (radians).', insertText: 'tan(${1:x})' },
                { label: 'log', detail: 'log(x, base) -> FLOAT', documentation: 'Logarithm with custom base.', insertText: 'log(${1:x}, ${2:base})' },
                { label: 'ln', detail: 'ln(x) -> FLOAT', documentation: 'Natural logarithm.', insertText: 'ln(${1:x})' },
                { label: 'pow', detail: 'pow(base, exponent) -> NUM', documentation: 'Power function.', insertText: 'pow(${1:base}, ${2:exponent})' },
                { label: 'exp', detail: 'exp(x) -> FLOAT', documentation: 'Exponential e^x.', insertText: 'exp(${1:x})' },
                { label: 'floor', detail: 'floor(x) -> NUM', documentation: 'Floor value.', insertText: 'floor(${1:x})' },
                { label: 'ceil', detail: 'ceil(x) -> NUM', documentation: 'Ceiling value.', insertText: 'ceil(${1:x})' },
                { label: 'round', detail: 'round(x, n) -> NUM', documentation: 'Round to n decimals.', insertText: 'round(${1:x}, ${2:n})' },
                { label: 'sum', detail: 'sum(x...) -> NUM', documentation: 'Sum of arguments or matrix elements.', insertText: 'sum(${1:x})' },
                { label: 'min', detail: 'min(x...) -> NUM', documentation: 'Minimum value.', insertText: 'min(${1:x})' },
                { label: 'max', detail: 'max(x...) -> NUM', documentation: 'Maximum value.', insertText: 'max(${1:x})' },
                { label: 'mean', detail: 'mean(x...) -> NUM', documentation: 'Arithmetic mean.', insertText: 'mean(${1:x})' },

                // Utilities
                { label: 'size', detail: 'size(A) -> MATRIX', documentation: 'Returns [rows, cols].', insertText: 'size(${1:A})' },
                { label: 'rows', detail: 'rows(A) -> INT', documentation: 'Number of rows.', insertText: 'rows(${1:A})' },
                { label: 'cols', detail: 'cols(A) -> INT', documentation: 'Number of columns.', insertText: 'cols(${1:A})' },
                { label: 'len', detail: 'len(x) -> INT', documentation: 'String length or total matrix elements.', insertText: 'len(${1:x})' },
                { label: 'contains', detail: 'contains(x, y) -> BOOL', documentation: 'Check if x contains y.', insertText: 'contains(${1:x}, ${2:y})' },
                { label: 'at', detail: 'at(x, i) -> STRING', documentation: 'Character at index i.', insertText: 'at(${1:x}, ${2:i})' },
                { label: 'type', detail: 'type(x) -> STRING', documentation: 'Returns the type name.', insertText: 'type(${1:x})' },
                { label: 'int', detail: 'int(x) -> INT', documentation: 'Cast to INT.', insertText: 'int(${1:x})' },
                { label: 'float', detail: 'float(x) -> FLOAT', documentation: 'Cast to FLOAT.', insertText: 'float(${1:x})' },
                { label: 'str', detail: 'str(x) -> STRING', documentation: 'Cast to STRING.', insertText: 'str(${1:x})' },
                { label: 'bool', detail: 'bool(x) -> BOOL', documentation: 'Cast to BOOL.', insertText: 'bool(${1:x})' },

                // File I/O
                { label: 'f_read', detail: 'f_read(path) -> STRING', documentation: 'Read file content.', insertText: 'f_read("${1:path}")' },
                { label: 'f_readline', detail: 'f_readline(path, i) -> STRING', documentation: 'Read i-th line.', insertText: 'f_readline("${1:path}", ${2:i})' },
                { label: 'f_lines', detail: 'f_lines(path) -> INT', documentation: 'Count lines in file.', insertText: 'f_lines("${1:path}")' },
                { label: 'f_write', detail: 'f_write(path, s) -> NULL', documentation: 'Write string to file (overwrite).', insertText: 'f_write("${1:path}", "${2:content}")' },
                { label: 'f_append', detail: 'f_append(path, s) -> NULL', documentation: 'Append string to file.', insertText: 'f_append("${1:path}", "${2:content}")' },

                // Generators
                { label: 'eye', detail: 'Identity matrix', documentation: 'eye(n) or eye(r, c)', insertText: 'eye(${1:n})' },
                { label: 'zeros', detail: 'Zero matrix', documentation: 'zeros(n) or zeros(r, c)', insertText: 'zeros(${1:n})' },
                { label: 'ones', detail: 'Ones matrix', documentation: 'ones(n) or ones(r, c)', insertText: 'ones(${1:n})' },
            ].map(item => ({
                ...item,
                kind: item.kind || monaco.languages.CompletionItemKind.Function,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }));

            return { suggestions };
        }
    });

    monaco.languages.setLanguageConfiguration('mrix', {
        comments: {
            lineComment: '//',
        },
        brackets: [
            ['{', '}'],
            ['(', ')'],
            ['[', ']'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '(', close: ')' },
            { open: '[', close: ']' },
            { open: '"', close: '"' },
        ],
    });
}