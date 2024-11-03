import { Body, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { CreateUrlAccessDto } from "./url.access.dto";
import { UrlAccessService } from "./url.access.service";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('url-access')
@Controller('url-access')
export class UrlAccessController {

  constructor(private readonly urlAcessService: UrlAccessService) { }

  @ApiProperty({ description: 'Generate reduced URL access' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUrlAccessDto): Promise<string> {
    return await this.urlAcessService.create(data)
  }

}
