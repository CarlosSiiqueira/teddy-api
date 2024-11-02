import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateUrlAccessDto } from "./url.access.dto";
import * as crypto from 'crypto'


@Injectable()
export class UrlAccessService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(data: CreateUrlAccessDto): Promise<string> {

    try {

      const id = crypto.randomUUID()

      await this.prismaService.urlAccess.create({
        data: {
          id,
          ...data
        }
      })

      return id
    } catch (error) {
      console.log(error)
    }
  }

}
