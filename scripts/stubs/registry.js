const getRegistry = (name, category_path, block_name, data) => {
  const importStatement = `// ${
    block_name.charAt(0) + block_name.slice(1).toLowerCase()
  }
import ${name}Definition from './blocks/${category_path}/${block_name.toLowerCase()}/definition';
import ${name}Stub from './blocks/${category_path}/${block_name.toLowerCase()}/generator';`;

  // Update the BLOCK_DEFINITIONS array
  const blockDefinitionsRegex =
    /export\sconst\sBLOCK_DEFINITIONS\s=\s\[\n([\s\S]*?)];/;
  const updatedBlockDefinitions = data.replace(
    blockDefinitionsRegex,
    (match, blockDefs) => {
      return `export const BLOCK_DEFINITIONS = [\n  ${blockDefs.trim()}\n  ${name}Definition,\n];`;
    },
  );

  // Update the BLOCK_STUBS array
  const blockStubsRegex = /export\sconst\sBLOCK_STUBS\s=\s\[\n([\s\S]*?)];/;
  const updatedBlockStubs = updatedBlockDefinitions.replace(
    blockStubsRegex,
    (match, blockStubs) => {
      return `export const BLOCK_STUBS = [\n  ${blockStubs.trim()}\n  ${name}Stub,\n];`;
    },
  );

  return `${importStatement}\n\n${updatedBlockStubs}`;
};

module.exports = { getRegistry };
