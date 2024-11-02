import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateUrlDto, UpdateUrlDto } from "./url.dto";
import * as crypto from 'crypto'
import { TidyUrl } from "@prisma/client";
import { generateShortCode } from "src/shared/utils/string";


@Injectable()
export class UrlService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(data: CreateUrlDto): Promise<string> {

    try {

      const id = crypto.randomUUID()
      const tidy_url = `http://localhost:${process.env.PORT}/${generateShortCode()}`;

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

  async find(tidy_url: string): Promise<TidyUrl | null> {

    return await this.prismaService.tidyUrl.findFirst({
      where: {
        tidy_url
      },
      include: {
        UrlAccess: true
      }
    })

  }

  async findAll(): Promise<TidyUrl[]> {

    const urls = await this.prismaService.tidyUrl.findMany({
      where: {
        deleted_at: null
      }
    })

    const rows = await Promise.all(
      urls.map(async (url) => {

        let _count = await this.prismaService.urlAccess.count({ where: { tidyUrlId: url.id } })

        Object.assign(url, {
          acessos: _count
        })

        return url
      })
    )

    return rows;
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
