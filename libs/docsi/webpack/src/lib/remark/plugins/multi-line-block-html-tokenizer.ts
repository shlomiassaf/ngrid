const markdown = require('remark-parse');

/**
 * Register a block tokenizer that runs after the built in `html` tokenizer.
 * This tokenizer add support to html elements with a multiline definition tag.
 *
 * In addition, it add support for attributes wrapped by square brackets (angular binding) for both
 * single and multiline tags.
 *
 * ```html
 * <my-element prop1="1"
 *             [prop2]="2"
 * </my-element>
 * ```
 */
export function registerMultilineBlockHtmlTokenizer() {
  const C_TAB = '\t';
  const C_SPACE = ' ';
  const C_NEWLINE = '\n';
  const C_LT = '<';
  const regex = /<([A-Za-z][A-Za-z0-9\-]*)(?:\s*\/?>|\s+[\[a-zA-Z_:][a-zA-Z0-9:._-]]*(?:\s*=\s*(?:[^"'=<>`\u0000-\u0020]+|'[^']*'|"[^"]*"))?)*\s*(.*)/


  const { blockMethods, blockTokenizers } = markdown.Parser.prototype;
  blockTokenizers.multilineBlockHTML = multilineBlockHTML;
  if (blockMethods.indexOf('multilineBlockHTML') === -1) {
    const htmlBlockMethodIndex = blockMethods.indexOf('html');
    blockMethods.splice(htmlBlockMethodIndex + 1, 0, 'multilineBlockHTML')
  }

  function multilineBlockHTML(eat, value: string, silent) {
    const getNextLine = (startIndex: number) => {
      let idx = value.indexOf(C_NEWLINE, startIndex);
      if (idx === -1) {
        idx = value.length;
      }
      ;
      return { index: idx, value: value.slice(startIndex, idx) };
    }

    let index = 0;
    let character: string;

    /* Eat initial spacing. */
    const length = value.length;
    while (index < length) {
      character = value.charAt(index);

      if (character !== C_TAB && character !== C_SPACE) {
        break;
      }

      index++;
    }

    if (value.charAt(index) !== C_LT) {
      return;
    }
    let nextLine = getNextLine(index);
    index = nextLine.index;

    const match = regex.exec(nextLine.value);
    if (match) {
      const closingTag = new RegExp(`</${match[1]}>`);
      while (true) {
        if (closingTag.test(nextLine.value)) {
          const subvalue = value.slice(0, index);
          return eat(subvalue)({type: 'html', value: subvalue});
        }
        if (nextLine.index >= value.length) {
          return;
        }
        nextLine = getNextLine(index + 1);
        index = nextLine.index;
      }
    }
  }
}
