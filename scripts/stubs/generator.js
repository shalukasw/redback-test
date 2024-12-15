const { CATEGORY_PATH_MAP } = require('./constants');

const getGenerator = (block_name, category) => {
  return `import { BlockType } from 'App/Lib/Blockly/types';
import Blockly from 'blockly';
import { BlockDefinition } from 'blockly/core/blocks';

const generator = (blocks: BlockDefinition) => {
  blocks[BlockType.${block_name}] = function (block: Blockly.Block) {
    let code = '// example';
    code += 'Modify this at App/Lib/Blockly/blocks/${
      CATEGORY_PATH_MAP[category]
    }/${block_name.toLowerCase()}/generator.ts';
    return code;
  };
};

export default generator;
`;
};

module.exports = { getGenerator };
