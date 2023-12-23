/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/* eslint-disable @typescript-eslint/no-var-requires */
const { createConnector } = require('@lxdao/uploader3-connector');

const connector = createConnector('NFT.storage', {
  token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGNBMDNlMDM3QjM5OWE3M2NkOTUyMUMyZGRFZjVjMjI3QjBkNTIyOUYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NjkxODk2NjUwNSwibmFtZSI6IndlYjNsb2dvLXRlc3QifQ.Dm-oKxHkPhf_KmFxlVqXeyd5Ybom-EQXQ_P2oMWyLmc'
});

const batchUpload = async (files) => {
  const imgData = files.map(async (i) => {
    const fileData = fs.readFileSync(i.path);
    const buffer = Buffer.from(fileData).toString('base64');
    const result = await connector.postImage({ data: buffer, type: i.type });
    return { ...i, url: result.url };
  });
  return Promise.all([...imgData]);
}


const filePath = path.join(__dirname, './svg');
const files = fs.readdirSync(filePath).map((fileName) => ({
  path: `${filePath}/${fileName}`,
  name: fileName.split('.')[0],
  type: fileName.split('.')[1],
}));

function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
const filesArray = chunkArray(files, 10);

let i = 0;
setInterval(async () => {
  if (i >= filesArray.length) {
    console.log('已经上传完毕');
    return;
  }
  try {
    const imgurl = await batchUpload(filesArray[i]);
    const result = await axios.post(
      'http://localhost:3000/logos/uploadImgByCode',
      imgurl,
    );
    console.log(result.data);
  } catch (e) {
    console.log(e);
    i--;
  }
  i++;
  console.log(i * 10);
}, 60000);
