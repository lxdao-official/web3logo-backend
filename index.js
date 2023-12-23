/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
    const result = await axios.post(
      'http://localhost:3000/logos/uploadImgByCode',
      filesArray[i],
    );
    console.log(result);
  } catch (e) {
    console.log(e);
    i--;
  }
  i++;
  console.log(i * 10);
}, 60000);
