import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDate, isString, isNotEmpty } from 'class-validator';

export class CreateUrlDto {

  @IsString()
  @IsNotEmpty()
  origin_url: string;

  @IsString()
  userId?: string;
}

export class UpdateUrlDto {

  @IsString()
  @IsNotEmpty()
  origin_url: string;

  @IsString()
  userId: string;
}
