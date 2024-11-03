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
  Put,
  Req
} from "@nestjs/common";
import { CreateUrlDto, UpdateUrlDto } from "./url.dto";
import { UrlService } from "./url.service";
import { TidyUrl } from '@prisma/client'
import { Request } from 'express'
import { UrlAccessService } from "src/url access/url.access.service";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('urls')
@Controller('/')
export class UrlController {

  constructor(
    private readonly urlService: UrlService,
    private readonly urlAccessService: UrlAccessService
  ) { }

  @ApiProperty({ description: 'Generate reduced URL' })
  @ApiResponse({ status: 201, description: 'Url Created' })
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUrlDto, @Req() request: Request): Promise<string> {

    let user

    if (request.headers?.user) {
      user = JSON.parse(request.headers.user as string);
      createUserDto.userId = user.id
    }

    return await this.urlService.create(createUserDto)
  }

  @ApiProperty({ description: 'List reduceds URLs' })
  @ApiResponse({ status: 200 })
  @Get('urls')
  async findAll(): Promise<TidyUrl[]> {
    return await this.urlService.findAll()
  }

  @ApiProperty({ description: 'Find target reduced URL' })
  @ApiResponse({ status: 200 })
  @Get(':url')
  async find(@Param('url') tidy_url: string, @Req() request: Request): Promise<string> {

    let newUrl = `http://localhost:${process.env.PORT}/${tidy_url}`
    const url = await this.urlService.find(newUrl)

    if (url) {

      let user

      if (request.headers?.user) {
        user = JSON.parse(request.headers.user as string);
      }

      await this.urlAccessService.create({ tidyUrlId: url.id, userid: user?.id || null })
      return 'Acesso registrado'
    }

    return 'url não encontrada'
  }

  @ApiProperty({ description: 'Update reduced URL' })
  @Put('urls/update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUrlDto): Promise<TidyUrl> {

    const url = await this.urlService.update(id, updateUserDto)

    if (!url) {
      throw new NotFoundException(`Url not found`)
    }

    return url
  }

  @ApiProperty({ description: 'Remove reduced URL' })
  @Delete('urls/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.urlService.delete(id)
  }

}
