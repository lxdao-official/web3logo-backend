import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  // async create(createUserDto: CreateUserDto) {
  //   const { address } = createUserDto;
  //   const user = await this.prismaService.users.create({ data: { address } });
  //   return user;
  // }

  // async findAll() {
  //   const result = await this.prismaService.users.findMany();
  //   return result;
  // }

  // async findOneById(id: number) {
  //   const user = await this.prismaService.users.findFirst({ where: { id } });
  //   return user;
  // }

  // async findOneByAddress(address: string) {
  //   const user = await this.prismaService.users.findFirst({
  //     where: { address },
  //   });
  //   return user;
  // }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
