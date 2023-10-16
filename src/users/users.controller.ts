import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Create user',
  })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    // return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
    description: 'Find all users',
  })
  findAll() {
    // return this.usersService.findAll();
  }

  @Get(':address')
  @ApiOperation({
    summary: 'Find user by address',
    description: 'Find user by address',
  })
  @ApiParam({
    name: 'address',
    type: 'string',
    description: "user's address",
  })
  findOneById(@Param('address') address: string) {
    // return this.usersService.findOneByAddress(address);
  }
}
