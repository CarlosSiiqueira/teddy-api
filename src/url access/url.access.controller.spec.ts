import { Test, TestingModule } from '@nestjs/testing'
import { UrlAccessController } from './url.access.controller'
import { UrlAccessService } from './url.access.service'
import { CreateUrlAccessDto } from './url.access.dto'

describe('UrlAccessController', () => {
  let controller: UrlAccessController
  let service: UrlAccessService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlAccessController],
      providers: [
        {
          provide: UrlAccessService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<UrlAccessController>(UrlAccessController)
    service = module.get<UrlAccessService>(UrlAccessService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new URL access and return it', async () => {
      const createUrlAccessDto: CreateUrlAccessDto = {
        tidyUrlId: 'url-id'
      }
      const expectedResult = 'shortened-url'

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult)

      const result = await controller.create(createUrlAccessDto)
      expect(result).toBe(expectedResult)
      expect(service.create).toHaveBeenCalledWith(createUrlAccessDto)
    })
  })
})
