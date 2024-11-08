import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateUrlDto, UpdateUrlDto } from "./url.dto";
import * as crypto from 'crypto'
import { TidyUrl } from "@prisma/client";
import { generateShortCode } from "src/shared/utils/string";
import { Warning } from "src/errors";
import { IUrlResponse } from "./url.model";


@Injectable()
export class UrlService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(data: CreateUrlDto, userId: string): Promise<string> {

    try {

      const id = crypto.randomUUID()
      const tidy_url = `http://localhost:${process.env.PORT}/${generateShortCode()}`;
      userId = userId ? userId : null

      await this.prismaService.tidyUrl.create({
        data: {
          id,
          ...data,
          tidy_url,
          userId
        }
      })

      return tidy_url
    } catch (error) {
      throw new Warning('Error creating url', 400)
    }
  }

  async find(tidy_url: string): Promise<IUrlResponse | null> {


    try {

      const url = await this.prismaService.tidyUrl.findFirst({
        where: {
          tidy_url
        },
        select: {
          id: true,
          origin_url: true,
          tidy_url: true,
          updated_at: true,
          User: {
            select: {
              username: true
            }
          },
          UrlAccess: {
            select: {
              last_access: true,
              User: {
                select: {
                  username: true
                }
              }
            }
          }
        }
      })

      return url
    } catch (error) {
      throw new Warning('Error finding url', 400)
    }

  }

  async findAll(user: string): Promise<IUrlResponse[]> {

    try {

      const urls = await this.prismaService.tidyUrl.findMany({
        where: {
          deleted_at: null,
          userId: user
        },
        select: {
          id: true,
          origin_url: true,
          tidy_url: true,
          updated_at: true,
          User: {
            select: {
              username: true
            }
          },
          UrlAccess: {
            select: {
              last_access: true,
              User: {
                select: {
                  username: true
                }
              }
            }
          }
        }
      })

      const rows = await Promise.all(
        urls.map(async (url) => {

          let _count = await this.prismaService.urlAccess.count(
            {
              where: {
                tidyUrlId: url.id,
                TidyUrl: {
                  userId: user,
                  deleted_at: null
                }
              }
            })

          Object.assign(url, {
            acessos: _count
          })

          return url
        })
      )

      return rows;

    } catch (error) {
      throw new Warning('Error listing urls', 400)
    }

  }

  async update(id: string, data: UpdateUrlDto): Promise<TidyUrl> {

    try {

      const url = await this.prismaService.tidyUrl.update({
        where: {
          id,
          deleted_at: null
        },
        data: {
          ...data,
          updated_at: new Date()
        }
      })

      return url

    } catch (error) {
      throw new Warning('Error updating url', 400)
    }

  }

  async delete(id: string): Promise<void> {

    try {

      await this.prismaService.tidyUrl.update({
        where: {
          id
        },
        data: {
          deleted_at: new Date()
        }
      })
    } catch (error) {
      throw new Warning('Error deleting url', 400)
    }

  }

}
