import * as monaco_editor from "monaco-editor";
import { editor } from "monaco-editor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const operators = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "=",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "&&",
  "||",
  "!",
];

const keywords = [
  "begin",
  "end",
  "is",
  "skip",
  "read",
  "free",
  "return",
  "exit",
  "print",
  "println",
  "if",
  "then",
  "else",
  "fi",
  "while",
  "do",
  "done",
  "newpair",
  "call",
  "fst",
  "snd",
  "int",
  "bool",
  "char",
  "string",
  "pair",
  "null",
];

export const waccSyntaxRules: monaco.languages.IMonarchLanguage = {
  keywords,
  operators,
  tokenizer: {
    root: [
      [
        /@?[a-zA-Z][\w$]*/,
        { cases: { "@keywords": "keyword", "@default": "variable" } },
      ],
      [/".*?"/, "string"],
      [/[\+\-\*/%=<>]=?|&&|\|\||!/, "operator"],
      [/#[^\r\n]*$/, "comment"],
    ],
  },
};

export const waccCompletionItemProvider: monaco.languages.CompletionItemProvider =
  {
    provideCompletionItems: (model, position, context, token) => {
      // Get the text before the cursor position
      const wordInfo = model.getWordUntilPosition(position);
      const currentWord = wordInfo.word;

      // Filter keywords based on the current word
      const filteredKeywords = keywords.filter((keyword) =>
        keyword.startsWith(currentWord)
      );

      // Remove duplicates from filteredKeywords
      const uniqueKeywords = Array.from(new Set(filteredKeywords));

      // Create CompletionItems for unique keywords
      const completionItems = uniqueKeywords.map((keyword) => ({
        label: keyword,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: keyword,
        range: new monaco.Range(
          position.lineNumber,
          wordInfo.startColumn,
          position.lineNumber,
          wordInfo.endColumn
        ),
      }));

      return {
        suggestions: completionItems,
      };
    },
  };

export const languageConfiguration = {
  onEnterRules: [
    {
      beforeText: new RegExp(`\\b(?:begin|then|is|do)\\s*$`),
      action: {
        indentAction: monaco.languages.IndentAction.Indent,
        appendText: "",
      },
    },
  ],
};
