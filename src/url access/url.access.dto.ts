import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUrlAccessDto {

  @IsString()
  @IsNotEmpty()
  tidyUrlId: string;

  @IsString()
  userid?: string;
}
