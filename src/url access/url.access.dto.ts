import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUrlAccessDto {

  @ApiProperty({ description: 'Reduced URL id' })
  @IsString()
  @IsNotEmpty()
  tidyUrlId: string;

  @ApiProperty({ description: 'User id' })
  @IsString()
  userid?: string;
}
