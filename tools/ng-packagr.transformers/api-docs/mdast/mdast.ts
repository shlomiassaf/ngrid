declare module 'unist' {
  export interface Node<T extends string = string> {
    // The variant of a node.
    type: T;

    // Information from the ecosystem.
    data?: Data

    // Location of a node in a source document.
    // Must not be present if a node is generated.
    position?: Position
  }

  // Location of a node in a source file.
  export interface Position {
    // Place of the first character of the parsed source region.
    start: Point

    // Place of the first character after the parsed source region.
    end: Point

    // Start column at each index (plus start line) in the source region,
    // for elements that span multiple lines.
    indent: number[]
  }

  // One place in a source file.
  export interface Point {
    // Line in a source file (1-indexed integer).
    line: number

    // Column in a source file (1-indexed integer).
    column: number

    // Character in a source file (0-indexed integer).
    offset: number
  }

  // Information associated by the ecosystem with the node.
  // Space is guaranteed to never be specified by unist or specifications
  // implementing unist.
  export interface Data {
    [key: string]: unknown
  }

  // Nodes containing other nodes.
  export interface Parent<TType extends string = string, TChildren extends Node = Node> extends Node<TType> {
    // List representing the children of a node.
    children: TChildren[];
  }

  // Nodes containing a value.
  export interface Literal<TType extends string = string, TValue = unknown> extends Node<TType> {
    // Any value
    value: TValue;
  }
}

declare module 'mdast' {
  import * as UNIST from 'unist';

  export type AlignType = 'left' | 'right' | 'center' | null;
  export type ReferenceType = 'shortcut' | 'collapsed' | 'full';

  export type Content = TopLevelContent | ListContent | TableContent | RowContent | PhrasingContent;
  export type TopLevelContent = BlockContent | FrontmatterContent | DefinitionContent;
  export type BlockContent = Paragraph | Heading | ThematicBreak | Blockquote | List | Table | HTML | Code;
  export type FrontmatterContent = YAML;
  export type DefinitionContent = Definition | FootnoteDefinition;
  export type ListContent = ListItem;
  export type TableContent = TableRow;
  export type RowContent = TableCell;
  export type PhrasingContent = StaticPhrasingContent | Link | LinkReference;
  export type StaticPhrasingContent = Text | Emphasis | Strong | Delete | HTML | InlineCode | Break | Image | ImageReference | Footnote | FootnoteReference

  interface Resource {
    url?: string;
    title?: string;
  }

  interface Association {
    identifier: string;
    label?: string;
  }

  interface Reference extends Association {
    referenceType: ReferenceType;
  }

  interface Alternative {
    alt?: string;
  }

  export interface Node<TType extends string> extends UNIST.Node<TType> { }
  export interface Parent<TType extends string, TContent extends Content = Content> extends UNIST.Parent<TType, TContent> { }
  export interface Literal<TType extends string> extends UNIST.Literal<TType, string> { }

  export interface Root extends Parent<'root'> { }

  export interface Paragraph extends Parent<'paragraph', PhrasingContent> { }

  export interface Heading extends Parent<'heading', PhrasingContent> {
    depth: 1 | 2 | 3 | 4 | 5 | 6;
  }

  export interface ThematicBreak extends Node<'thematicBreak'> { }

  export interface Blockquote extends Parent<'blockquote', BlockContent> { }

  export interface List extends Parent<'list', ListContent> {
    ordered?: boolean;
    start?: number;
    spread?: number;
  }

  export interface ListItem extends Parent<'listItem', BlockContent> {
    checked?: boolean;
    spread?: number;
  }

  export interface Table extends Parent<'table', TableContent> {
    align: AlignType[];
  }

  export interface TableRow extends Parent<'tableRow', RowContent> { }

  export interface TableCell extends Parent<'tableCell', PhrasingContent> { }

  export interface HTML extends Literal<'html'> { }

  export interface Code extends Literal<'code'> {
    lang?: string;
    meta?: string;
  }

  export interface YAML extends Literal<'yaml'> { }

  export interface Definition extends Node<'definition'>, Association, Resource { }

  export interface FootnoteDefinition extends Parent<'footnoteDefinition', BlockContent>, Association { }

  export interface Text extends Literal<'text'> { }

  export interface Emphasis extends Parent<'emphasis', PhrasingContent> { }

  export interface Strong extends Parent<'strong', PhrasingContent> { }

  export interface Delete extends Parent<'delete', PhrasingContent> { }

  export interface InlineCode extends Literal<'inlineCode'> { }

  export interface Break extends Node<'break'> { }

  export interface Link extends Parent<'link', StaticPhrasingContent>, Resource { }

  export interface Image extends Node<'image'>, Resource, Alternative { }

  export interface LinkReference extends Parent<'linkReference', StaticPhrasingContent>, Reference { }

  export interface ImageReference extends Node<'imageReference'>, Reference, Alternative { }

  export interface Footnote extends Parent<'footnote', PhrasingContent> { }

  export interface FootnoteReference extends Node<'footnoteReference'>, Association { }

  export interface MdTypeMap {
    root: Root;
    paragraph: Paragraph;
    heading: Heading;
    thematicBreak: ThematicBreak;
    blockquote: Blockquote;
    list: List;
    listItem: ListItem;
    table: Table;
    tableRow: TableRow;
    tableCell: TableCell;
    html: HTML;
    code: Code;
    yaml: YAML;
    definition: Definition;
    footnoteDefinition: FootnoteDefinition;
    text: Text;
    emphasis: Emphasis;
    strong: Strong;
    delete: Delete;
    inlineCode: InlineCode;
    break: Break;
    link: Link;
    image: Image;
    linkReference: LinkReference;
    imageReference: ImageReference;
    footnote: Footnote;
    footnoteReference: FootnoteReference;
  }
}
