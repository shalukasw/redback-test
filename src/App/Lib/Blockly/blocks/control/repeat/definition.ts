import {
  BLOCK_COLOR_CODES,
  BlockCategory,
  BlockType,
} from 'App/Lib/Blockly/types';
import { BlockDefinition } from 'blockly/core/blocks';
import Blockly from 'blockly/core';

const definition = (blocks: BlockDefinition) => {
  blocks.Blocks[BlockType.REPEAT] = {
    init: function () {
      this.appendDummyInput()
        .appendField('repeat')
        .appendField(new blocks.FieldNumber(10, 1, 20), 'TIMES')
        .appendField('times');
      this.appendStatementInput('CODE_VALUE').setCheck(null);
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(
          new blocks.FieldImage(
            './loop.svg',
            15,
            15,
            'loop',
            console.log,
            true,
          ),
        );

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLOR_CODES[BlockCategory.CONTROL]);
      this.setTooltip('repeat a single or group of blocks');
    },
  };
};

export default definition;
