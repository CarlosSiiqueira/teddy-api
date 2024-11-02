import { Body, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { CreateUrlAccessDto } from "./url.access.dto";
import { UrlAccessService } from "./url.access.service";


@Controller('url-access')
export class UrlAccessController {

  constructor(private readonly urlAcessService: UrlAccessService) { }

  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUrlAccessDto): Promise<string> {
    return await this.urlAcessService.create(data)
  }

}