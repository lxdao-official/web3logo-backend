import { Test, TestingModule } from '@nestjs/testing';
import { UploadImgController } from './upload-img.controller';
import { UploadImgService } from './upload-img.service';

describe('UploadImgController', () => {
  let controller: UploadImgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadImgController],
      providers: [UploadImgService],
    }).compile();

    controller = module.get<UploadImgController>(UploadImgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
