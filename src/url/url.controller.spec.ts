import { Test, TestingModule } from '@nestjs/testing'
import { UrlController } from './url.controller'
import { UrlService } from './url.service'
import { UrlAccessService } from 'src/url access/url.access.service'
import { CreateUrlDto, UpdateUrlDto } from './url.dto'
import { TidyUrl } from '@prisma/client'
import { NotFoundException } from '@nestjs/common'
import { Request } from 'express'

describe('UrlController', () => {
  let urlController: UrlController
  let urlService: UrlService
  let urlAccessService: UrlAccessService

  const mockUrlService = {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  const mockUrlAccessService = {
    create: jest.fn(),
  }

  const createMockRequest = (userId: string): Request => {
    return {
      headers: {
        user: JSON.stringify({ id: userId }),
      },

      get: jest.fn((name: string) => {
        if (name === 'user') return JSON.stringify({ id: userId })
      }),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),


      ...jest.requireActual('express').Request,
    } as unknown as Request
  }



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        { provide: UrlService, useValue: mockUrlService },
        { provide: UrlAccessService, useValue: mockUrlAccessService },
      ],
    }).compile()

    urlController = module.get<UrlController>(UrlController)
    urlService = module.get<UrlService>(UrlService)
    urlAccessService = module.get<UrlAccessService>(UrlAccessService)
  })

  describe('create', () => {
    it('should create a new URL and return its ID', async () => {
      const createUrlDto: CreateUrlDto = { origin_url: "www.url.com.br" }
      const userId = 'user-id'
      const createdUrlId = 'url-id'
      const request = createMockRequest(userId)

      mockUrlService.create.mockResolvedValue(createdUrlId)

      const result = await urlController.create(createUrlDto, request)
      expect(result).toBe(createdUrlId)
      expect(mockUrlService.create).toHaveBeenCalledWith(createUrlDto, userId)
    })
  })

  describe('findAll', () => {
    it('should return an array of URLs', async () => {
      const userId = 'user-id'
      const urls: TidyUrl[] = [
        {
          id: 'url1',
          origin_url: 'short.url1/123456',
          tidy_url: 'short.url1/123456',
          updated_at: null,
          deleted_at: null,
          userId: null
        },
        {
          id: 'url2',
          origin_url: 'short.url2/123456',
          tidy_url: 'short.url2/123456',
          updated_at: null,
          deleted_at: null,
          userId: null
        }]

      const request = createMockRequest(userId)

      mockUrlService.findAll.mockResolvedValue(urls)

      const result = await urlController.findAll(request)
      expect(result).toEqual(urls)
      expect(mockUrlService.findAll).toHaveBeenCalledWith(userId)
    })
  })

  describe('find', () => {
    it('should return a success message and register access for a valid URL', async () => {
      const tidyUrl = 'short.url/1'
      const urlObject = { id: 'url-id', tidyUrl: 'short.url/1' }
      const request = createMockRequest('user-id')

      mockUrlService.find.mockResolvedValue(urlObject)
      mockUrlAccessService.create.mockResolvedValue(undefined)

      const result = await urlController.find(tidyUrl, request)
      expect(result).toBe('Acesso registrado')
      expect(mockUrlService.find).toHaveBeenCalledWith(`http://localhost:${process.env.PORT}/${tidyUrl}`)
      expect(mockUrlAccessService.create).toHaveBeenCalledWith({ tidyUrlId: urlObject.id, userid: 'user-id' })
    })

    it('should return a message for an invalid URL', async () => {
      const tidyUrl = 'short.url/invalid'
      const request = createMockRequest('user-id')

      mockUrlService.find.mockResolvedValue(null)

      const result = await urlController.find(tidyUrl, request)
      expect(result).toBe('url não encontrada')
    })
  })

  describe('update', () => {
    it('should update a URL and return the updated URL', async () => {
      const id = 'url-id'
      const updateUrlDto: UpdateUrlDto = { origin_url: 'www.myurltest.com.br' }
      const updatedUrl = { id, tidyUrl: 'updated-url' }

      mockUrlService.update.mockResolvedValue(updatedUrl)

      const result = await urlController.update(id, updateUrlDto)
      expect(result).toEqual(updatedUrl)
      expect(mockUrlService.update).toHaveBeenCalledWith(id, updateUrlDto)
    })

    it('should throw NotFoundException if the URL is not found', async () => {
      const id = 'url-id'
      const updateUrlDto: UpdateUrlDto = { origin_url: 'www.test.com.br' }

      mockUrlService.update.mockResolvedValue(null)

      await expect(urlController.update(id, updateUrlDto)).rejects.toThrow(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should delete a URL and return no content', async () => {
      const id = 'url-id'

      await urlController.delete(id)
      expect(mockUrlService.delete).toHaveBeenCalledWith(id)
    })
  })
})
