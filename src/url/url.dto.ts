import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUrlDto {

  @ApiProperty({ description: 'Target URL' })
  @IsString()
  @IsNotEmpty()
  origin_url: string;
  
}

export class UpdateUrlDto {

  @ApiProperty({ description: 'Target URL' })
  @IsString()
  @IsNotEmpty()
  origin_url: string;

  @ApiProperty({ description: 'User id' })
  @IsString()
  userId: string;
}
