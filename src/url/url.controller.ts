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
import { CreateUrlDto, UpdateUrlDto } from "./url.dto";
import { UrlService } from "./url.service";
import { TidyUrl } from '@prisma/client'

@Controller('/')
export class UrlController {

  constructor(private readonly urlService: UrlService) { }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUrlDto): Promise<string> {
    return await this.urlService.create(createUserDto)
  }

  @Get('url/findAll')
  async findAll(): Promise<TidyUrl[]> {
    return await this.urlService.findAll()
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<TidyUrl> {
    return await this.urlService.find(id)
  }

  @Put('url/update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUrlDto): Promise<TidyUrl> {

    const url = await this.urlService.update(id, updateUserDto)

    if (!url) {
      throw new NotFoundException(`Url not found`)
    }

    return url
  }

  @Delete('url/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.urlService.delete(id)
  }
  
}
