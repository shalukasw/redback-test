const getUpdatedBlockType = (data) =>
  data.replace(/export\senum\sBlockType\s{([\s\S]*?)}/, (match, enumBody) => {
    const updatedEnumBody = `${enumBody}  SERVO = 'servo',`;
    return `export enum BlockType {${updatedEnumBody}
}`;
  });

module.exports = { getUpdatedBlockType };
