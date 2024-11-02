import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateUrlDto, UpdateUrlDto } from "./url.dto";
import * as crypto from 'crypto'
import { TidyUrl } from "@prisma/client";


@Injectable()
export class UrlService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(data: CreateUrlDto): Promise<string> {

    try {

      const id = crypto.randomUUID()
      const tidy_url = 'aaaa';

      await this.prismaService.tidyUrl.create({
        data: {
          id,
          ...data,
          tidy_url
        }
      })

      return id
    } catch (error) {

    }
  }

  async find(id: string): Promise<TidyUrl> {

    return await this.prismaService.tidyUrl.findUnique({
      where: {
        id
      },
      include: {
        UrlAccess: true
      }
    })

  }

  async findAll(): Promise<TidyUrl[]> {

    return await this.prismaService.tidyUrl.findMany({
      where: {
        deleted_at: null
      },
      include: {
        UrlAccess: true
      }
    })

  }

  async update(id: string, data: UpdateUrlDto): Promise<TidyUrl> {

    try {

      const tidy_url = 'as'

      const url = await this.prismaService.tidyUrl.update({
        where: {
          id
        },
        data: {
          ...data,
          tidy_url
        }
      })

      return url

    } catch (error) {

    }

  }

  async delete(id: string): Promise<void> {

    await this.prismaService.tidyUrl.delete({
      where: {
        id
      }
    })

  }

}
