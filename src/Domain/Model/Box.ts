export interface Box {
  identifier: string;
  name: string;
  board: string;
  boardDetails: {
    fqbn: string;
    processor: string;
    bootloader: string;
    baud: number;
    protocol: string;
    productId: string[]; // hex
    signature: string[]; // hex
  };
  blockTemplateName: string;
}
