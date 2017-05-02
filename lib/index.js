'use strict';

// Check if a given Program is only a re-export statement
function isReExportOnly(program) {
  return isExportOnly(program) && exportIsReExport(program.body[0]);
}

// Check if a given Program is only an export statement
function isExportOnly(program) {
  return program.body.length === 1 && program.body[0].type === 'ExportNamedDeclaration';
}

// Check if the given export statement is a re-export
function exportIsReExport(exportNamedDeclaration) {
  return !!exportNamedDeclaration.source && !!exportNamedDeclaration.specifiers.length;
}

// Get the source of a re-export for the given Program
function getReExportSource(program) {
  return program.body[0].source.value;
}

// Constructs a define.alias expression for the given source and alias
function constructDefineAlias(t, source, alias) {
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(
        t.identifier('define'),
        t.identifier('alias')
      ),
      [
        t.stringLiteral(source),
        t.stringLiteral(alias)
      ]
    )
  );
}

module.exports = function(babel) {
  const t = babel.types;

  return {
    visitor: {
      Program:{
        // On enter, we check if the program is a re-export
        enter(path, state) {
          const program = path.node;
          if (isReExportOnly(program)) {
            state.reexport = {
              source: getReExportSource(program)
            };
          }
        },

        // On exit, if the program is a re-export, we rewrite it to an alias
        exit(path, state) {
          if (state.reexport) {
            const source = state.reexport.source;
            const alias = this.getModuleName();
            const newProgram = t.program( [ constructDefineAlias(t, source, alias) ] );

            path.replaceWith(newProgram);
            path.stop();
          }
        }
      }
    }
  };
};
