/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { createConnector } = require('@lxdao/uploader3-connector');

const connector = createConnector('NFT.storage', {
  token: process.env.IPFS_TOKEN,
});

export default async (files) => {
  const imgData = files.map(async (i) => {
    const fileData = fs.readFileSync(i.path);
    const buffer = Buffer.from(fileData).toString('base64');
    const result = await connector.postImage({ data: buffer, type: i.type });
    return { ...i, url: result.url } as {
      name: string;
      url: string;
      type: string;
    };
  });
  return Promise.all([...imgData]);
};
