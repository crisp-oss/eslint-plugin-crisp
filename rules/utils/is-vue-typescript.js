const TYPESCRIPT_LANGS = ["ts", "tsx"];

export default function isVueTypeScript(context) {
  if (!context.filename.endsWith(".vue")) {
    return false;
  }

  const parserServices = context.sourceCode.parserServices;
  const fragment = parserServices?.getDocumentFragment?.();

  if (!fragment) {
    return false;
  }

  return fragment.children.some((node) => {
    return (
      node.type === "VElement" &&
      node.name === "script" &&
      node.startTag.attributes.some((attribute) => {
        return (
          !attribute.directive &&
          attribute.key.name === "lang" &&
          TYPESCRIPT_LANGS.includes(attribute.value?.value)
        );
      })
    );
  });
}
