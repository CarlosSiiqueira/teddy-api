import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDate, isString, isNotEmpty } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'User Password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {

  @ApiProperty({ description: 'User Name' })
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ description: 'User Password' })
  @IsString()
  @IsNotEmpty()
  password?: string;
}

export class LoginUserDto {

  @ApiProperty({ description: 'User Name' })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ description: 'User Password' })
  @IsString()
  @IsNotEmpty()
  password: string
}
