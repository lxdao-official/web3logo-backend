import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as download from 'download';
import * as fs from 'fs';
import axios from 'axios';
import { LogosService } from 'src/logos/logos.service';

@Injectable()
export class UploadImgService {
  private readonly s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  constructor(private logosService: LogosService) {}
  async uploadFile(files: Array<Express.Multer.File>): Promise<any[]> {
    try {
      const uploadFiles = files.map(async (file) => {
        console.log('file', file);
        const type = file.originalname.split('.').pop();
        const name = `${uuidv4()}.${type}`;
        const params = {
          Bucket: 'lxdao-img-bucket',
          Key: name,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        const result = await this.s3.upload(params).promise();
        const url = result.Location.replace(
          'https://lxdao-img-bucket.s3.amazonaws.com',
          'https://cdn.lxdao.io',
        );
        return { name: file.originalname, url };
      });

      return Promise.all(uploadFiles);
    } catch (err) {
      console.log(err);
    }
  }

  async updateErrorFiles() {
    const logos = await this.logosService.findAllLogs();
    const newImgs = logos
      .filter((b) => b.file.length > 84 && !b.file.includes('nftstorage.link'))
      .map((b) => {
        return {
          id: b.id,
          file: `${b.file.slice(0, 81)}svg`,
        };
      });
    await this.logosService.batchUpdateFile(newImgs);
    return { data: newImgs };
  }

  async downloadImgs() {
    const projects = await this.logosService.findAllLogs();
    const newImgPromise = projects.map(async (b) => {
      try {
        const key = 'file';
        const url = b[key];
        const cid = this.getIpfsCid(url);
        if (!cid) {
          console.log('失败 1');
          return false;
        }
        const response = await axios.head(url);
        if (response.status != 200) {
          console.log('失败 2');
          return false;
        }
        const contentType = response.headers['content-type'];
        const type = contentType.includes('svg')
          ? 'svg'
          : contentType.split('/').pop();

        const imgName = `${cid}.${type}`;
        fs.writeFileSync(`imgs/${imgName}`, await download(url));
        const info = {
          id: b.id,
          [key]: `https://cdn.lxdao.io/${imgName}`,
        };
        console.log('成功');
        return info;
      } catch (err) {
        console.log(err.message);
        console.log('失败 3');
        console.log(b.id);
      }
    });
    const newImgs = (await Promise.all(newImgPromise)).filter(
      (i) => i && i.id,
    ) as unknown as {
      id: number;
      file: string;
    }[];
    await this.logosService.batchUpdateFile(newImgs);
    console.log('end');
    return { data: newImgs };
  }

  getIpfsCid(ipfsUrl) {
    // https://cloudflare-ipfs.com/ipfs/bafkreid67qrfaq2yqacnsvpvfnetjocgy7kiuwu4jw4v23tc3yqgfgis2e
    // https://bafkreid67qrfaq2yqacnsvpvfnetjocgy7kiuwu4jw4v23tc3yqgfgis2e.ipfs.nftstorage.link/
    // to
    // bafkreid67qrfaq2yqacnsvpvfnetjocgy7kiuwu4jw4v23tc3yqgfgis2e
    let cid = '';
    if (ipfsUrl && ipfsUrl.includes('cloudflare-ipfs')) {
      cid = ipfsUrl.replace('https://cloudflare-ipfs.com/ipfs/', '');
    } else if (ipfsUrl && ipfsUrl.includes('ipfs.nftstorage.link')) {
      cid = ipfsUrl
        .replace('https://', '')
        .replace('.ipfs.nftstorage.link', '');
    } else if (ipfsUrl && ipfsUrl.includes('https://nftstorage.link/ipfs/')) {
      cid = ipfsUrl.replace('https://nftstorage.link/ipfs/', '');
    }
    if (cid.indexOf('/') > -1) {
      cid = cid.replace('/', '');
    }
    return cid;
  }
}
