import pako from 'pako';

export interface CompressedFile {
  name: string;
  compressed: Uint8Array;
  originalSize: number;
  compressedSize: number;
}

export const compressFile = (content: string, fileName: string): CompressedFile => {
  const uint8array = new TextEncoder().encode(content);
  const compressed = pako.gzip(uint8array);
  
  return {
    name: fileName,
    compressed,
    originalSize: uint8array.length,
    compressedSize: compressed.length,
  };
};

export const decompressFile = (compressed: Uint8Array): string => {
  const decompressed = pako.ungzip(compressed);
  return new TextDecoder().decode(decompressed);
};

export const compressProject = (files: { name: string; content: string }[]): Blob => {
  const compressedFiles = files.map(file => ({
    name: file.name,
    content: compressFile(file.content, file.name),
  }));

  const projectData = JSON.stringify(compressedFiles);
  const compressed = pako.gzip(new TextEncoder().encode(projectData));
  
  return new Blob([compressed], { type: 'application/gzip' });
};

export const decompressProject = async (blob: Blob): Promise<{ name: string; content: string }[]> => {
  const arrayBuffer = await blob.arrayBuffer();
  const compressed = new Uint8Array(arrayBuffer);
  const decompressed = pako.ungzip(compressed);
  const projectData = new TextDecoder().decode(decompressed);
  
  const compressedFiles = JSON.parse(projectData);
  
  return compressedFiles.map((file: any) => ({
    name: file.name,
    content: decompressFile(new Uint8Array(file.content.compressed)),
  }));
};
