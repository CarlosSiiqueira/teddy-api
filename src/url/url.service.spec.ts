import { Test, TestingModule } from '@nestjs/testing'
import { UrlService } from './url.service'
import { PrismaService } from 'prisma/prisma.service'
import { CreateUrlDto, UpdateUrlDto } from './url.dto'
import { Warning } from 'src/errors'
import { TidyUrl } from '@prisma/client'
import { generateShortCode } from 'src/shared/utils/string'

describe('UrlService', () => {
  let urlService: UrlService
  let prismaService: PrismaService

  const mockPrismaService = {
    tidyUrl: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    urlAccess: {
      count: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    urlService = module.get<UrlService>(UrlService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  describe('create', () => {
    it('should create a new URL and return its tidy_url', async () => {
      const createUrlDto: CreateUrlDto = { origin_url: 'http://example.com' }
      const userId = 'user-id'
      const expectedUrl = 28

      mockPrismaService.tidyUrl.create.mockResolvedValue({
        id: 'some-id',
        tidy_url: 'expectedUrl.com.br',
        ...createUrlDto,
        userId,
      })

      const result = await urlService.create(createUrlDto, userId)

      expect(result).toHaveLength(expectedUrl)
      expect(mockPrismaService.tidyUrl.create).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          ...createUrlDto,
          tidy_url: result,
          userId,
        },
      })
    })

    it('should throw a Warning if an error occurs', async () => {
      const createUrlDto: CreateUrlDto = { origin_url: 'http://example.com' }
      const userId = 'user-id'

      mockPrismaService.tidyUrl.create.mockRejectedValue(new Error('Database error'))

      await expect(urlService.create(createUrlDto, userId)).rejects.toThrow(Warning)
    })
  })

  describe('find', () => {
    it('should return a TidyUrl object for a valid tidy_url', async () => {
      const tidyUrl = 'http://localhost:3000/short-code'
      const expectedUrl: TidyUrl = {
        id: 'some-id',
        tidy_url: tidyUrl,
        origin_url: 'http://example.com',
        userId: null,
        deleted_at: null,
        updated_at: null
      }

      mockPrismaService.tidyUrl.findFirst.mockResolvedValue(expectedUrl)

      const result = await urlService.find(tidyUrl)
      expect(result).toEqual(expectedUrl)
      expect(mockPrismaService.tidyUrl.findFirst).toHaveBeenCalledWith({
        where: { tidy_url: tidyUrl },
        include: { UrlAccess: true },
      })
    })

    it('should return null if no URL is found', async () => {
      const tidyUrl = 'http://localhost:3000/short-code'

      mockPrismaService.tidyUrl.findFirst.mockResolvedValue(null)

      const result = await urlService.find(tidyUrl)
      expect(result).toBeNull()
    })

    it('should throw a Warning if an error occurs', async () => {
      const tidyUrl = 'http://localhost:3000/short-code'

      mockPrismaService.tidyUrl.findFirst.mockRejectedValue(new Error('Database error'))

      await expect(urlService.find(tidyUrl)).rejects.toThrow(Warning)
    })
  })

  describe('findAll', () => {
    it('should return an array of TidyUrl objects', async () => {
      const userId = 'user-id'
      const urls: TidyUrl[] = [
        {
          id: 'url1',
          origin_url: 'http://example1.com',
          tidy_url: 'short.url1',
          userId,
          deleted_at: null,
          updated_at: null
        },
        {
          id: 'url2',
          origin_url: 'http://example2.com',
          tidy_url: 'short.url2',
          userId,
          deleted_at: null,
          updated_at: null
        }
      ]

      mockPrismaService.tidyUrl.findMany.mockResolvedValue(urls)
      mockPrismaService.urlAccess.count.mockResolvedValueOnce(2).mockResolvedValueOnce(3)

      const result = await urlService.findAll(userId)
      expect(result).toEqual([
        { ...urls[0], acessos: 2 },
        { ...urls[1], acessos: 3 },
      ])
      expect(mockPrismaService.tidyUrl.findMany).toHaveBeenCalledWith({
        where: {
          deleted_at: null,
          userId,
        },
      })
    })

    it('should throw a Warning if an error occurs', async () => {
      const userId = 'user-id'

      mockPrismaService.tidyUrl.findMany.mockRejectedValue(new Error('Database error'))

      await expect(urlService.findAll(userId)).rejects.toThrow(Warning)
    })
  })

  describe('update', () => {
    it('should update a URL and return the updated TidyUrl object', async () => {
      const id = 'url-id'
      const updateUrlDto: UpdateUrlDto = { origin_url: 'http://updated.com' }
      const updatedUrl: TidyUrl = {
        id,
        origin_url: 'http://updated.com',
        tidy_url: 'short.url',
        userId: null,
        deleted_at: null,
        updated_at: null
      }

      mockPrismaService.tidyUrl.update.mockResolvedValue(updatedUrl)

      const result = await urlService.update(id, updateUrlDto)
      expect(result).toEqual(updatedUrl)
      expect(mockPrismaService.tidyUrl.update).toHaveBeenCalledWith({
        where: { id, deleted_at: null },
        data: { ...updateUrlDto, updated_at: expect.any(Date) },
      })
    })

    it('should throw a Warning if the URL is not found', async () => {
      const id = 'url-id'
      const updateUrlDto: UpdateUrlDto = { origin_url: 'http://updated.com' }

      mockPrismaService.tidyUrl.update.mockRejectedValue(new Error('Database error'))

      await expect(urlService.update(id, updateUrlDto)).rejects.toThrow(Warning)
    })
  })

  describe('delete', () => {
    it('should delete a URL by id', async () => {
      const id = 'some-unique-id'

      jest.spyOn(prismaService.tidyUrl, 'update').mockResolvedValue(undefined)

      await urlService.delete(id)

      expect(prismaService.tidyUrl.update).toHaveBeenCalledWith({
        where: { id },
        data: { deleted_at: expect.any(Date) },
      })
    })

    it('should throw a Warning when an error occurs', async () => {
      const id = 'some-unique-id'

      jest.spyOn(prismaService.tidyUrl, 'update').mockRejectedValue(new Error('Database error'))

      await expect(urlService.delete(id)).rejects.toThrow(Warning)
      await expect(urlService.delete(id)).rejects.toThrow('Error deleting url')
    })
  })
})
