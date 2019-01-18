import { ParameterReflection, ProjectReflection, SignatureReflection, TraverseProperty, TypeParameterReflection } from "typedoc";
import { Context } from "typedoc/dist/lib/converter";
import { DeclarationReflection, IntrinsicType, Reflection } from "typedoc/dist/lib/models";

patchRemoveReflection();

function patchRemoveReflection() {
  if (!Context.prototype.removeReflection) {
    const removeReflection = function (project: ProjectReflection,
                                       reflection: Reflection,
                                       removeStaleParent?: boolean) {
      reflection.traverse((child) => removeReflection(project, child, removeStaleParent));

      const parent = <DeclarationReflection> reflection.parent;
      parent.traverse((child: Reflection, property: TraverseProperty) => {
        if (child === reflection) {
          switch (property) {
            case TraverseProperty.Children:
              if (parent.children) {
                const index = parent.children.indexOf(<DeclarationReflection> reflection);
                if (index !== -1) {
                  parent.children.splice(index, 1);
                }
              }
              break;
            case TraverseProperty.GetSignature:
              delete parent.getSignature;
              if (removeStaleParent && !parent.setSignature) {
                removeReflection(project, reflection.parent, removeStaleParent);
              }
              break;
            case TraverseProperty.IndexSignature:
              delete parent.indexSignature;
              break;
            case TraverseProperty.Parameters:
              if ((<SignatureReflection> reflection.parent).parameters) {
                const index = (<SignatureReflection> reflection.parent).parameters.indexOf(<ParameterReflection> reflection);
                if (index !== -1) {
                  (<SignatureReflection> reflection.parent).parameters.splice(index, 1);
                }
              }
              break;
            case TraverseProperty.SetSignature:
              delete parent.setSignature;
              if (removeStaleParent && !parent.getSignature) {
                removeReflection(project, reflection.parent, removeStaleParent);
              }
              break;
            case TraverseProperty.Signatures:
              if (parent.signatures) {
                const index = parent.signatures.indexOf(<SignatureReflection> reflection);
                if (index !== -1) {
                  parent.signatures.splice(index, 1);
                  if (parent.signatures.length === 0) {
                    removeReflection(project, reflection.parent, removeStaleParent);
                  }
                }
              }
              break;
            case TraverseProperty.TypeLiteral:
              parent.type = new IntrinsicType('Object');
              break;
            case TraverseProperty.TypeParameter:
              if (parent.typeParameters) {
                const index = parent.typeParameters.indexOf(<TypeParameterReflection> reflection);
                if (index !== -1) {
                  parent.typeParameters.splice(index, 1);
                }
              }
              break;
          }
        }
      });

      let id = reflection.id;
      delete project.reflections[id];

      for (let key in project.symbolMapping) {
        if (project.symbolMapping.hasOwnProperty(key) && project.symbolMapping[key] === id) {
          delete project.symbolMapping[key];
        }
      }
    };
    Context.prototype.removeReflection = function(this: Context, reflection: Reflection, removeStaleParent: boolean) {
      return removeReflection(this.project, reflection, removeStaleParent);
    }
  }
}

declare module 'typedoc/dist/lib/converter/context.d' {
  interface Context {
    removeReflection(reflection: Reflection, removeStaleParent?: boolean);
  }
}
