import { Test, TestingModule } from '@nestjs/testing';
import { UrlAccessService } from './url.access.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUrlAccessDto } from './url.access.dto';
import * as crypto from 'crypto';
import { Warning } from 'src/errors';
import { UrlAccess } from '@prisma/client';

describe('UrlAccessService', () => {
  let service: UrlAccessService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlAccessService,
        {
          provide: PrismaService,
          useValue: {
            urlAccess: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UrlAccessService>(UrlAccessService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new URL access and return its id', async () => {
      const createUrlAccessDto: CreateUrlAccessDto = {
        tidyUrlId: 'url-id'
      };
      const expectedId = crypto.randomUUID();
      const payload: UrlAccess = {
        id: expectedId,
        tidyUrlId: 'url-id',
        last_access: new Date(),
        userid: 'user-id'
      }

      jest.spyOn(crypto, 'randomUUID').mockReturnValue(expectedId);
      jest.spyOn(prismaService.urlAccess, 'create').mockResolvedValue(payload);

      const result = await service.create(createUrlAccessDto);
      expect(result).toBe(expectedId);
      expect(prismaService.urlAccess.create).toHaveBeenCalledWith({
        data: {
          id: expectedId,
          ...createUrlAccessDto,
        },
      });
    });

    it('should throw a Warning when an error occurs', async () => {
      const createUrlAccessDto: CreateUrlAccessDto = {
        tidyUrlId: 'url-id'
      };
      jest.spyOn(prismaService.urlAccess, 'create').mockRejectedValue(new Error('Database error'));

      await expect(service.create(createUrlAccessDto)).rejects.toThrow(Warning);
      await expect(service.create(createUrlAccessDto)).rejects.toThrow('Error generating access');
    });
  });
});
