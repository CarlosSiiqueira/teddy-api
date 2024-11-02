import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./user.dto";
import { UserService } from "./user.service";
import { Users } from '@prisma/client'

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.userService.create(createUserDto)
  }

  @Get()
  async findAll(): Promise<Users[]> {
    return await this.userService.findAll()
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<Users> {
    return await this.userService.find(id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Users> {

    const user = await this.userService.update(id, updateUserDto)

    if (!user) {
      throw new NotFoundException(`User not found`)
    }

    return user
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id)
  }

  @Post('auth')
  async auth(@Body() data: LoginUserDto): Promise<{ token: string } | null> {
    return await this.userService.authenticate(data.username, data.password)
  }

}
