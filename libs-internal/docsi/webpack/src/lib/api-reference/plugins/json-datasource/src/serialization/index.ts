import { Component } from "typedoc/dist/lib/converter/components";
import { Reflection, ReflectionFlag, ReflectionKind } from "typedoc/dist/lib/models";
import * as TYPES from "typedoc/dist/lib/models/types";

import {
  Serializer,
  ReflectionSerializer,
  SourceReferenceContainerSerializer,
  TypeSerializer,
  SourceReferenceWrapper,
  SerializeEvent
} from 'typedoc/dist/lib/serialization';

let NEXT_SOURCE_ID = 0;
let NEXT_TYPE_ID = 0;

@Component({name: 'serializer:json-datasource-reflection'})
export class JSONDataStructureReflectionSerializer extends ReflectionSerializer {

  static PRIORITY = -1000; // run last

  private project: any;
  private reflections: any;

  initialize(): void {
    super.initialize();

    this.listenTo(this.owner, {
        [Serializer.EVENT_BEGIN]: this.onProjectBegin,
        [Serializer.EVENT_END]:   this.onProjectEnd
    }, undefined, -1000);

  }

  toObject(reflection: Reflection, obj?: any): any {

    if (obj) {
      this.minify(reflection, obj);

      if (!reflection.isProject()) {
        obj = obj || {};

        this.reflections[reflection.id] = obj;


        return reflection.id;
      }
    }

    return obj;
  }

  private minify(reflection: Reflection, obj: any): void {
    // no verbose flags, use the number
    if (reflection.flags.flags) {
      obj.flags = reflection.flags.flags;
    } else {
      delete obj.flags;
    }

    if (obj.kindString) {
      delete  obj.kindString;
    }
  }

  private onProjectBegin(event: SerializeEvent): void {
    this.project = event.output;
    getTABLES(event.output).reflections = this.reflections = {};
  }

  private onProjectEnd(event: SerializeEvent): void {
    const TABLES = getTABLES(event.output);

    TABLES.reflections = this.reflections;

    // Include the mappings for ReflectionFlag
    TABLES.ReflectionFlag = enumToObject(ReflectionFlag);
    // Include the mappings for ReflectionKind
    TABLES.ReflectionKind = enumToObject(ReflectionKind);

    this.project = this.reflections = undefined;
  }

}

@Component({name: 'serializer:json-datasource-type'})
export class JSONDataStructureTypeSerializer extends TypeSerializer {

  static PRIORITY = -1000; // run last

  private project: any;
  private types: any;
  private typeMap: any;

  initialize(): void {
    super.initialize();

    this.listenTo(this.owner, {
      [Serializer.EVENT_BEGIN]: this.onProjectBegin,
      [Serializer.EVENT_END]:   this.onProjectEnd
    }, undefined, -1000);

  }

  toObject(type: TYPES.Type, obj?: any): any {
    if (this.project) {
      let key: string;
      switch (type.type) {
        case 'intrinsic':
          key = this.createIntrinsicKey(<any> type);
          break;
        case 'reference':
          key = this.createReferenceKey(<any> type);
          break;
      }

      if (key) {
        if (this.typeMap.hasOwnProperty(key)) {
          return this.typeMap[key];
        } else {
          this.types[this.typeMap[key] = NEXT_TYPE_ID++] = obj;
          return NEXT_TYPE_ID;
        }
      } else {
        this.types[NEXT_TYPE_ID++] = obj;
        return NEXT_TYPE_ID;
      }

    } else {
      return obj;
    }
  }

  private createIntrinsicKey(t: TYPES.IntrinsicType): string {
    return t.type + t.name;
  }

  private createReferenceKey(t: TYPES.ReferenceType): string {
    return t.type + t.symbolID;
  }

  private onProjectBegin(event: SerializeEvent): void {
    this.project = event.output;
    getTABLES(event.output).types = this.types = {};
    this.typeMap = {};
  }

  private onProjectEnd(event: SerializeEvent): void {
    getTABLES(event.output).types = this.types; // just in case...
    this.project = this.types = this.typeMap = undefined;
  }

}


@Component({name: 'serializer:json-datasource-source'})
export class JSONDataStructureSourceSerializer extends SourceReferenceContainerSerializer {

  static PRIORITY = -1000; // run last

  private project: any;
  private sources: any;

  private files: { [fileName: string]: number };

  initialize(): void {
    super.initialize();

    this.listenTo(this.owner, {
      [Serializer.EVENT_BEGIN]: this.onProjectBegin,
      [Serializer.EVENT_END]:   this.onProjectEnd
    }, undefined, -1000);

  }

  toObject(sourceReferenceContainer: SourceReferenceWrapper, obj?: any): any {
    if (this.project) {

      let id: number;
      if (this.files.hasOwnProperty(obj.fileName)) {
        id = this.files[obj.fileName];
      } else {
        this.sources[this.files[obj.fileName] = NEXT_SOURCE_ID++] = obj.fileName;
        id = NEXT_SOURCE_ID;
      }


      return [id, obj.line, obj.character]
    } else {
      return obj;
    }
  }

  private onProjectBegin(event: SerializeEvent): void {
    this.project = event.output;
    getTABLES(event.output).sources = this.sources = {};
    this.files = {};
  }

  private onProjectEnd(event: SerializeEvent): void {
    getTABLES(event.output).sources = this.sources; // just in case...
    this.project = this.sources = this.files = undefined;
  }

}

export function verifyRegistration(serializer: Serializer): void {
  if (!serializer.hasComponent('serializer:json-datasource-reflection')) {
    serializer.addComponent('serializer:json-datasource-reflection', JSONDataStructureReflectionSerializer);
    serializer.addComponent('serializer:json-datasource-type', JSONDataStructureTypeSerializer);
    serializer.addComponent('serializer:json-datasource-source', JSONDataStructureSourceSerializer);
  }
}

function getTABLES(obj: any): any {
  if (!obj.TABLES) {
    obj.TABLES = {};
  }
  return obj.TABLES;
}

function enumToObject(enumType: any): { [indexs: number]: string } {
  return Object.keys(enumType).reduce( (prev, curr) => {
    const key = Number(curr);
    if (!Number.isNaN(key)) {
      prev[key] = enumType[curr];
    }
    return prev;
  }, {})
}
