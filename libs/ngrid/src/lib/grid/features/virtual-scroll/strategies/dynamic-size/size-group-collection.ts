import { SizeGroup } from './size-group';

export class SizeGroupCollection {

  get collection() { return this._groups; }

  get length() { return this._groups.length; }

  private _groups: SizeGroup[] = [];

  set(group: SizeGroup) {
    const groupIndex = group.groupIndex;
    const index = this.findGroupIndexIndex(groupIndex, true);
    if (index === -1) {
      this._groups.push(group);
    } else {
      const closestGroup = this._groups[index];
      if (closestGroup.groupIndex === groupIndex) {
        this._groups[groupIndex] = group;
      } else if (closestGroup.groupIndex < groupIndex) {
        this._groups.splice(index + 1, 0, group);
      } else {
        this._groups.splice(index, 0, group);
      }
    }
  }

  remove(groupIndex: number) {
    const index = this.findGroupIndexIndex(groupIndex);
    if (index > -1) {
      this._groups.splice(index, 1);
      return true;
    }
    return false;
  }

  get(groupIndex: number): SizeGroup | undefined {
    return this._groups[this.findGroupIndexIndex(groupIndex)];
  }

  has(groupIndex: number) {
    return this.findGroupIndexIndex(groupIndex) > -1;
  }

  clear() {
    this._groups = [];
  }

  protected findGroupIndexIndex(groupIndex: number, matchClosest?: boolean) {
    let start = 0;
    let end = this._groups.length - 1;
    let mid = -1;

    while (start <= end){
      mid = Math.floor((start + end) / 2);

      if (this._groups[mid].groupIndex === groupIndex) {
        return mid;
      } else if (this._groups[mid].groupIndex < groupIndex) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    return matchClosest ? mid : -1;
  }
}
