import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import crypto from 'crypto'
import { Users } from "@prisma/client";

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateUserDto): Promise<string> {

    try {

      const id = crypto.randomUUID()

      await this.prisma.users.create({
        data: {
          id,
          ...data
        }
      })

      return id
    } catch (error) {

    }
  }

  async find(id: string): Promise<Users> {

    const user = await this.prisma.users.findUnique({
      where: {
        id
      }
    })

    return user
  }

  async findAll(): Promise<Users[]> {

    return await this.prisma.users.findMany({
      where: {
        deleted_at: null
      }
    })

  }

  async update(id: string, data: UpdateUserDto): Promise<Users> {


    const user = await this.prisma.users.update({
      data: {
        ...data
      },
      where: {
        id
      }
    })

    return user
  }

  async delete(id: string): Promise<void> {

    await this.prisma.users.update({
      where: {
        id
      },
      data: {
        deleted_at: new Date()
      }
    })
  }

}
