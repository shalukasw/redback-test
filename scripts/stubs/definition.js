const { CATEGORY_PATH_MAP } = require('./constants');

const getDefinition = (block_name, category) => {
  return `import {
  BLOCK_COLOR_CODES,
  BlockCategory,
  BlockType,
} from 'App/Lib/Blockly/types';
import { BlockDefinition } from 'blockly/core/blocks';

const definition = (blocks: BlockDefinition) => {
  blocks.Blocks[BlockType.${block_name}] = {
    init: function () {
      // You can customize these
      this.appendDummyInput().appendField(
        'Modify this at App/Lib/Blockly/blocks/${
          CATEGORY_PATH_MAP[category]
        }/${block_name.toLowerCase()}/definition.ts',
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLOR_CODES[BlockCategory.${category}]);
    },
  };
};

export default definition;
`;
};

module.exports = { getDefinition };
