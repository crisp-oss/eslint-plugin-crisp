const SCOPE_REGEX = /^\s*\*\s*@(public|private|protected)/;
const GENERATOR_REGEX = /^\s*\*\s*@generator/;
const CLASS_REGEX = /^\s*\*\s*@class\b/;
const CLASSDESC_REGEX = /^\s*\*\s*@classdesc\s*(.*)/;
const PARAM_REGEX = /^\s*\*\s*@param\s*\{\s*(.+?)\s*\}\s*(\S+)/;
const RETURN_REGEX = /^\s*\*\s*@return\s*\{\s*(.+?)\s*\}\s*(.*)/;
const YIELD_REGEX = /^\s*\*\s*@yields\s*\{\s*(.+?)\s*\}\s*(.*)/;

function parseJSDoc(jsdoc) {
  const lines = jsdoc.split('\n');
  const params = [];
  let returnLine = null;
  let yieldLine = null;
  let classAnnotation = false;
  let classDescription = "";
  let description = '';
  let scope = '';
  let generator = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.match(CLASS_REGEX)) {
      classAnnotation = true;
      continue; // Skip this line and continue with the next
    }

    if (line.match(CLASSDESC_REGEX)) {
      classDescription = line.match(CLASSDESC_REGEX)[1];
      continue; // Skip this line and continue with the next
    }

    // If the line matches any of the other regexes, break out of the loop
    if (
      line.match(SCOPE_REGEX) ||
      line.match(PARAM_REGEX) ||
      line.match(RETURN_REGEX) ||
      line.match(YIELD_REGEX)
    ) {
      break;
    }

    // Append each line to the description, removing leading " * " if present, and adding a newline character
    description += line.replace(/^\s*\*/, '').trim() + '\n';
  }

  description = description.trim();

  for (const line of lines) {
    const paramMatch = line.match(PARAM_REGEX);
    if (paramMatch) {
      const [, type, name] = paramMatch;
      params.push({ type, name });
    }

    const returnMatch = line.match(RETURN_REGEX);
    if (returnMatch) {
      let [, type, desc] = returnMatch;

      if (type && type[0] === "{" && desc[0] === "}") {
        if (desc && desc[0] === "}") {
          desc = desc.substring(1, desc.length);

          type += " }";
        }
      }

      returnLine = { type, description: desc.trim() };
    }

    const yieldMatch = line.match(YIELD_REGEX);
    if (yieldMatch) {
      let [, type, desc] = yieldMatch;

      if (type && type[0] === "{" && desc[0] === "}") {
        if (desc && desc[0] === "}") {
          desc = desc.substring(1, desc.length);

          type += " }";
        }
      }

      yieldLine = { type, description: desc.trim() };
    }

    const scopeMatch = line.match(SCOPE_REGEX);
    if (scopeMatch) {
      scope = scopeMatch[1];
    }

    const generatorMatch = line.match(GENERATOR_REGEX);
    if (generatorMatch) {
      generator = true;
    }
  }

  return { description, scope, params, returnLine, yieldLine, generator };
}

function formatJSDoc(parsedJSDoc, indentation=0) {
  let maxTypeLength = 0;
  let indent = ' '.repeat(indentation);

  // Calculate the maximum type length from params
  for (const param of parsedJSDoc.params) {
    if (param.type.length > maxTypeLength) {
      maxTypeLength = param.type.length;
    }
  }

  // Check the return/yield type length if it exists
  if (parsedJSDoc.returnLine && parsedJSDoc.returnLine && parsedJSDoc.returnLine.type.length > maxTypeLength && parsedJSDoc.returnLine.description) {
    maxTypeLength = parsedJSDoc.returnLine.type.length;
  } else if (parsedJSDoc.yieldLine && parsedJSDoc.yieldLine && parsedJSDoc.yieldLine.type.length > maxTypeLength && parsedJSDoc.yieldLine.description) {
    maxTypeLength = parsedJSDoc.yieldLine.type.length;
  }

  let jsdoc = '/**\n'

  jsdoc += indent + '* ' +parsedJSDoc.description.replace("\n", "\n" + indent + "*   ") + "\n";

  if (parsedJSDoc.scope) {
    jsdoc += indent + '* @' + parsedJSDoc.scope + '\n';
  }

  if (parsedJSDoc.generator) {
    jsdoc += indent + '* @generator\n';
  }

  // Format params with padding based on maximum type length
  for (const param of parsedJSDoc.params) {
    const paddingType = ' '.repeat(Math.max(0, maxTypeLength - param.type.length));
    jsdoc += indent + `* @param  {${param.type}}${paddingType} ${param.name}\n`;
  }

  // Format return with padding based on maximum type length
  if (parsedJSDoc.returnLine) {
    const paddingType = ' '.repeat(Math.max(0, maxTypeLength - parsedJSDoc.returnLine.type.length));
    let _return = `* @return {${parsedJSDoc.returnLine.type}}${paddingType} ${parsedJSDoc.returnLine.description}`.trimEnd();

    jsdoc += indent + _return + "\n";
  }

  // Format yield with padding based on maximum type length
  if (parsedJSDoc.yieldLine) {
    const paddingType = ' '.repeat(Math.max(0, maxTypeLength - parsedJSDoc.yieldLine.type.length));
    let _yield = `* @yields {${parsedJSDoc.yieldLine.type}}${paddingType} ${parsedJSDoc.yieldLine.description}`.trimEnd();

    jsdoc += indent + _yield + "\n";
  }

  jsdoc += indent + '*/';

  return jsdoc;
}


export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce alignment for JSDoc',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'whitespace',
  },

  create: function(context) {
    return {
      Program: function(node) {
        const comments = context.getSourceCode().getAllComments(node);

        comments
          .filter(comment => comment.type === 'Block' && comment.value.startsWith('*'))
          .forEach(jsdocComment => {
            const lines = jsdocComment.value.split('\n');
            const jsdocString = `/*${jsdocComment.value}*/`;
            const parsedJSDoc = parseJSDoc(jsdocString);
            const indentation = lines.length > 2 ? lines[1].match(/^\s*/)[0].length : 0; // Capture indentation from the first line
            const formattedJSDoc = formatJSDoc(parsedJSDoc, indentation);

            if (jsdocString !== formattedJSDoc && parsedJSDoc.description && parsedJSDoc.scope) {
              context.report({
                node: jsdocComment,
                message: 'JSDoc alignment issue',

                fix(fixer) {
                  return fixer.replaceText(jsdocComment, formattedJSDoc);
                },
              });
            }
          });
      },
    };
  },
};
