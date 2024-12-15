#!/usr/bin/env node

const path = require('path');
const clc = require('cli-color');
const { program } = require('commander');
const { getDefinition } = require('./stubs/definition');
const { getGenerator } = require('./stubs/generator');
const { getRegistry } = require('./stubs/registry');
const { CATEGORY_PATH_MAP } = require('./stubs/constants');
const { getUpdatedBlockType } = require('./stubs/block-type');
const { createOrUpdateFile, getFileContent } = require('./utils');
const { exec } = require('child_process');

program
  .version('1.0.0')
  .description('Generate and register a block under a specified category');

const error = (value) => console.log(clc.whiteBright.bold.bgRedBright(value));
const success = (value) =>
  console.log(clc.whiteBright.bold.bgGreenBright(value));
const info = (value) => console.log(clc.whiteBright.bold.bgCyanBright(value));

const createDefinition = async (name, options) => {
  return new Promise(async (res, rej) => {
    try {
      const block_name = name.toUpperCase();
      const category_type = options.category.toUpperCase();
      if (!Object.keys(CATEGORY_PATH_MAP).includes(category_type)) {
        error(
          `invalid category type, possible values are: ${Object.values(
            CATEGORY_PATH_MAP,
          )}`,
        );
        rej(false);
        return;
      }
      const category = category_type.toUpperCase();
      const content = getDefinition(block_name, category);

      const filePath = path.join(
        'src/App/Lib/Blockly/blocks',
        CATEGORY_PATH_MAP[category_type],
        block_name.toLowerCase(),
        'definition.ts',
      );
      await createOrUpdateFile(filePath, content);
      info(`✓ ${filePath}`);
      res(true);
    } catch (err) {
      error(err);
      rej(false);
    }
  });
};

const createGenerator = async (name, options) => {
  return new Promise(async (res, rej) => {
    const block_name = name.toUpperCase();
    const category_type = options.category.toUpperCase();
    if (!Object.keys(CATEGORY_PATH_MAP).includes(category_type)) {
      error(
        `invalid category type, possible values are: ${Object.values(
          CATEGORY_PATH_MAP,
        )}`,
      );
      rej(false);
      return;
    }
    const category = category_type.toUpperCase();
    const content = getGenerator(block_name, category);

    const filePath = path.join(
      'src/App/Lib/Blockly/blocks',
      CATEGORY_PATH_MAP[category_type],
      block_name.toLowerCase(),
      'generator.ts',
    );

    try {
      await createOrUpdateFile(filePath, content);
      info(`✔ ${filePath}`);
      res(true);
    } catch (err) {
      error(err);
      rej(err);
    }
  });
};

const addToBlockType = async () => {
  return new Promise(async (res, rej) => {
    try {
      const filePath = path.join('src/App/Lib/Blockly', 'types.ts');
      const data = await getFileContent(filePath);
      await createOrUpdateFile(filePath, getUpdatedBlockType(data));
      info(`✓ BlockType updated`);
      res(true);
    } catch (err) {
      error(err);
      rej(false);
    }
  });
};

const addToBlockRegistry = async (name, options) => {
  return new Promise(async (res, rej) => {
    const block_name = name.toUpperCase();
    const category_type = options.category.toUpperCase();

    const filePath = path.join('src/App/Lib/Blockly', 'blocks-registry.ts');
    try {
      const data = await getFileContent(filePath);

      const name = block_name.toLowerCase();
      const category_path = CATEGORY_PATH_MAP[category_type];
      const updatedData = getRegistry(name, category_path, block_name, data);

      await createOrUpdateFile(filePath, updatedData);
      info(`✔ Added to registry: ${filePath}`);
      res(true);
    } catch (err) {
      error(err);
      rej(false);
    }
  });
};

const createBlock = () => {
  program
    .command('block <name>')
    .alias('b')
    .requiredOption('-c, --category <type>', 'Type')
    .description('Generate and register a block under a specified category')
    .action(async (name, options) => {
      try {
        const p1 = await addToBlockType(name);
        const p2 = await createDefinition(name, options);
        const p3 = await createGenerator(name, options);
        const p4 = await addToBlockRegistry(name, options);
        await Promise.all([p1, p2, p3, p4]);
        success('🎉 Block stubs have been generated!');
      } catch (err) {
        // TODO: rollback
      }
    });
};

const main = async () => {
  await createBlock();
  program.parse(process.argv);
};

main();
