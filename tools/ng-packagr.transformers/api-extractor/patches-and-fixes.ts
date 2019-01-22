import * as ts from '@microsoft/api-extractor/node_modules/typescript';

// PackageMetadataManager.isAedocSupportedFor is not safe
// SEE: https://github.com/Microsoft/web-build-tools/issues/1044
// TODO: remove when issue is fixed
import { PackageMetadataManager } from '@microsoft/api-extractor/lib/analyzer/PackageMetadataManager';
const { isAedocSupportedFor } = PackageMetadataManager.prototype;
PackageMetadataManager.prototype.isAedocSupportedFor = function (sourceFilePath: string) {
  try {
    return isAedocSupportedFor.call(this, sourceFilePath);
  } catch (err) {
    return false;
  }
};

// handle merged (augmented) symbols properly
// SEE: https://github.com/Microsoft/web-build-tools/issues/1045
// TODO: remove when issue is fixed
import { AstSymbolTable } from '@microsoft/api-extractor/lib/analyzer/AstSymbolTable';
const { _fetchAstSymbol } = AstSymbolTable.prototype as any;
(AstSymbolTable.prototype as any)._fetchAstSymbol = function (followedSymbol, addIfMissing, astImportOptions, localName) {
  let result = _fetchAstSymbol.call(this, followedSymbol, addIfMissing, astImportOptions, localName);
  if (!result && astImportOptions && followedSymbol.flags & ts.SymbolFlags.Transient) {
    followedSymbol.flags = followedSymbol.flags ^ ts.SymbolFlags.Transient;
    result = _fetchAstSymbol.call(this, followedSymbol, addIfMissing, astImportOptions, localName);
    followedSymbol.flags = followedSymbol.flags | ts.SymbolFlags.Transient;
  }
  return result;
};
