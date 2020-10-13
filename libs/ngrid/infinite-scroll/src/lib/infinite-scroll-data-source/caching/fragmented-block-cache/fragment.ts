export class Fragment {

  static calcEnd(startRow: number, count: number) {
    return startRow + count - 1;
  }

  get size(): number { return this.end - this.start + 1; }
  get empty() { return this.size === 0; }

  constructor(public start: number, public end: number) { }

  containsRow(rowIndex: number) {
    return rowIndex >= this.start && rowIndex <= this.end;
  }

  equals(f: Fragment) {
    return this.start === f.start && this.end === f.end;
  }
}
