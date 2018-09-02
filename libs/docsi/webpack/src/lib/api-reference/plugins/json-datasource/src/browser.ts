import * as O from 'typedoc/dist/lib/serialization';

export interface DataSourceTable<T> {
  [id: string]: T
}


export type DSReflectionContainer
  = Pick<O.ReflectionContainer, 'id' | 'name' | 'kind' | 'originalName'> & { flags: number };

/**
 * Contains source file reference id and source code line and character reference
 *
 * Index    Description
 * 0        The source file reference id, use to get the source file from the sources table
 * 1        The line number
 * 2        The character number
 *
 * For example, the value [3, 9, 27] means that the reflection has a source reference
 * to source file 3 at line 9 character 27
 */
export type DSSourceReferenceObject = [number, number, number];

export interface DSReflectionObject extends DSReflectionContainer,
                                            Partial<O.CommentContainer<O.CommentObject>>,
                                            Partial<O.DecoratesContainer>,
                                            Partial<O.DecoratorsContainer<O.DecoratorObject>> { }

export interface DSParameterReflectionObject extends  DSReflectionObject,
                                                      O.TypeContainer,
                                                      O.DefaultValueContainer {}

export interface DSContainerReflectionObject extends  DSReflectionObject,
                                                      Partial<O.SourceReferenceContainer<DSSourceReferenceObject>>,
                                                      Partial<O.GroupsContainer<O.ReflectionGroupObject>>,
                                                      O.ContainerReflectionContainer<number> {}

export interface DSDeclarationReflectionObject extends  DSContainerReflectionObject,
                                                        O.DefaultValueContainer,
                                                        Partial<O.TypeContainer>,
                                                        Partial<O.TypeParameterContainer>,
                                                        Partial<O.SignatureReflectionContainer<DSParameterReflectionObject>>,
                                                        O.DeclarationReflectionContainer<DSSignatureReflectionObject> {}

export interface DSSignatureReflectionObject extends  DSReflectionObject,
                                                      Partial<O.SignatureReflectionContainer<DSParameterReflectionObject>>,
                                                      Partial<O.TypeContainer>,
                                                      Partial<O.TypeParameterContainer> { }

export interface DSProjectReflectionObject extends  Partial<O.SourceReferenceContainer<DSSourceReferenceObject>>,
                                                    Partial<O.GroupsContainer<O.ReflectionGroupObject>>,
                                                    O.ContainerReflectionContainer<number> {
  id:             number;
  name:           string;
  kind:           number;
  TABLES: ProjectDataSource;
}

export interface ProjectDataSource {
  reflections: DataSourceTable<DSReflectionObject>;
  types: DataSourceTable<O.TypeObject>;
  sources: DataSourceTable<string>;
  ReflectionFlag: DataSourceTable<string>;
  ReflectionKind: DataSourceTable<string>;
}
