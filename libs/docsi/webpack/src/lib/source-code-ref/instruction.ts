
import * as OS from 'os';
import * as FS from 'fs';
import * as Path from 'path';

import { parse, ParserResult } from './parser';
import { SourceCodeRef, SourceCodeRefMetadata } from './models';

export class ParsedInstructionCache {
  private _cache = new Map<string, ParserResult>();;

  constructor(public readonly pwd: string) { };

  createInstruction(i: SourceCodeRefMetadata): Instruction {
    const instruction = new Instruction(i, this.pwd);
    if (!this.has(instruction)) {
      instruction.parseResult = this.set(instruction);
      instruction.isNew = true;
    } else {
      instruction.parseResult = this.get(instruction);
      instruction.isNew = false;
    }
    if ( i.section && !instruction.parseResult.sections[ i.section ] ) {
      throw new Error(`Could not find pbl code extract section "${i.section}" in ${i.file}`);
    }
    return instruction;
  }

  protected has(instruction: Instruction): boolean {
    return this._cache.has(instruction.fullPath);
  }

  protected get(instruction: Instruction): ParserResult {
    return this._cache.get(instruction.fullPath);
  }

  protected set(instruction: Instruction): ParserResult {
    const parsed = parse(instruction.instruction.code || FS.readFileSync(instruction.fullPath, { encoding: 'utf-8' }), instruction.lang);
    this._cache.set(instruction.fullPath, parsed);
    return parsed;
  }
}

export class Instruction {

  readonly fullPath: string;
  readonly lang: string;
  parseResult: ParserResult;
  isNew: boolean;

  private _extractedCode: SourceCodeRef;
  constructor(public readonly instruction: SourceCodeRefMetadata, public readonly pwd: string) {
    this.fullPath = this.getFullpath(pwd, instruction.file);
    this.lang = this.getLang();
    this.verify(instruction);
  }

  toExtractedCode(force?: boolean): SourceCodeRef {
    if (!this._extractedCode || force) {
      const i = this.instruction;
      const parsedResult = this.parseResult;

      const code: SourceCodeRef = <any> { file: Path.basename(i.file), lang: this.lang };

      if (i.slice) {
        code.code = parsedResult.lines.slice(i.slice[0], i.slice[1] + 1)
          .filter( (s, idx) => !parsedResult.ignoredLines[idx] )
          .join(OS.EOL);
      } else {
        code.section = i.section || 'default';
        code.code = parsedResult.sections[ i.section ] || parsedResult.root;
      }

      if ( i.id ) {
        code.id = i.id;
      }

      if ( i.title ) {
        code.title = i.title;
      }
      this._extractedCode = code;
    }
    return this._extractedCode;
  }

  protected readFile(): string {
    return FS.readFileSync(this.fullPath, { encoding: 'utf-8' })
  }

  protected getLang(): string {
    return this.instruction.lang || Path.extname(this.instruction.file).substr(1);
  }

  protected getFullpath(pwd: string, file: string): string {
    return Path.isAbsolute(file) && file[0] === Path.sep[0]
      ? file
      : Path.resolve(pwd, file)
    ;
  }

  protected verify(i: SourceCodeRefMetadata) {
    if ( i.section && i.slice ) {
      throw new Error(`"section" and "slice" are now allowed together`);
    }
    if ( i.section && i.section === 'default' ) {
      throw new Error(`"default" sections is reserved and can not be used in a CodeExtractionInstructions.`);
    }
    if (!FS.existsSync(this.fullPath)) {
      throw new Error(`Could not find pbl code ref file ${i.file} within the context of ${this.pwd}`);
    }
  }
}
