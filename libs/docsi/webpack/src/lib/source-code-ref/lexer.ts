const lexers = new Map<keyof Lexers, LexerGroup>();
const languages = new Map<string, keyof Lexers>();

export interface LexerGroup {
  section: RegExp;
  ignore: RegExp;
  ignoreLine: RegExp;
  ignoreNextLine: RegExp;
}

export interface Lexers {
  htmlStyle: LexerGroup;
  codeStyle: LexerGroup;
}

export interface LanguageToLexerGroupMap {
  html: LexerGroup;
  md: LexerGroup;
  ts: LexerGroup;
  scss: LexerGroup;
  css: LexerGroup;
}

export function setLexerGroup(name: keyof Lexers, lg: LexerGroup): void {
  lexers.set(name, lg);
}

export function getLexerGroup(name: keyof Lexers): LexerGroup | undefined {
  return lexers.get(name);
}

export function bindLanguage(lang: keyof LanguageToLexerGroupMap, lexerName: keyof Lexers): void {
  languages.set(lang, lexerName);
}

export function getLanguageLexerGroup(lang: keyof LanguageToLexerGroupMap): LexerGroup | undefined {
  const lexerName = languages.get(lang);
  return lexerName && lexers.get(lexerName);
}

setLexerGroup('htmlStyle', {
  section: /<!--\s*@pebula-example:(.+)\s*-->/,
  ignore: /<!--\s*@pebula-ignore:(.+)\s*-->/,
  ignoreLine: /<!--\s*@pebula-ignore-line\s*(?!:\s*-->):?(.+)?-->/,
  ignoreNextLine: /<!--\s*@pebula-ignore-next-line\s*(?!:\s*-->):?(.+)?-->/
});

setLexerGroup('codeStyle', {
  section: /\/\*\s*@pebula-example:(.+)\*\//,
  ignore: /\/\*\s*@pebula-ignore:(.+)\*\//,
  ignoreLine: /\/\*\s*@pebula-ignore-line\s*(?!:\s*\*\/):?(.+)?\*\//,
  ignoreNextLine: /\/\*\s*@pebula-ignore-next-line\s*(?!:\s*\*\/):?(.+)?\*\//
});

bindLanguage('html', 'htmlStyle');
bindLanguage('md', 'htmlStyle');
bindLanguage('ts', 'codeStyle');
bindLanguage('scss', 'codeStyle');
bindLanguage('css', 'codeStyle');
