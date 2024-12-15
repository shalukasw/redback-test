import { BlockCategory, BlockType } from 'App/Lib/Blockly/types';
import { ToolboxDefinition } from 'blockly/core/utils/toolbox';

const toolbox: string | ToolboxDefinition | Element = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: BlockCategory.COMMENT,
      icons: {},
      contents: [
        {
          kind: 'block',
          type: BlockType.COMMENT,
        },
        {
          kind: 'block',
          type: BlockType.TITLE,
        },
      ],
    },
    {
      kind: 'category',
      name: BlockCategory.CONTROL,
      contents: [
        {
          kind: 'block',
          type: BlockType.WAIT,
        },
        {
          kind: 'block',
          type: BlockType.REPEAT,
        },
        {
          kind: 'block',
          type: BlockType.IDLE_FOREVER,
        },
        {
          kind: 'block',
          type: BlockType.IF_DO,
        },
        {
          kind: 'block',
          type: BlockType.LOGIC_COMPARE,
        },
        {
          kind: 'block',
          type: BlockType.LOGIC_OPERATION,
        },
      ],
    },
    {
      kind: 'category',
      name: BlockCategory.IO,
      contents: [
        {
          kind: 'block',
          type: BlockType.DIGITAL_WRITE,
        },
        {
          kind: 'block',
          type: BlockType.ANALOG_WRITE,
        },
        {
          kind: 'block',
          type: BlockType.ULTRASONIC_PIN,
        },
        {
          kind: 'block',
          type: BlockType.ULTRASONIC_DISTANCE,
        },
        {
          kind: 'block',
          type: BlockType.PIN_STATE,
        },
        {
          kind: 'block',
          type: BlockType.INFRARED_READ,
        },
        {
          kind: 'block',
          type: BlockType.INFRARED_SETUP,
        },
        {
          kind: 'block',
          type: BlockType.NUMBER,
        },
      ],
    },
    {
      kind: 'category',
      name: BlockCategory.VARIABLES,
      custom: 'VARIABLE', // blockly default type
    },
  ],
};

export default toolbox;
