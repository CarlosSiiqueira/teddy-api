import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { PrismaService } from 'prisma/prisma.service'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto'
import { Users } from '@prisma/client'
import { Warning } from 'src/errors'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

describe('UserService', () => {
  let userService: UserService
  let prismaService: PrismaService

  const mockPrismaService = {
    users: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  describe('create', () => {
    it('should create a user and return its id', async () => {
      const createUserDto: CreateUserDto = { username: 'test', password: 'test123' }
      const userId = crypto.randomUUID()
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(userId)

      mockPrismaService.users.create.mockResolvedValue({ id: userId, ...createUserDto })

      const result = await userService.create(createUserDto)
      expect(result).toBe(userId)
      expect(mockPrismaService.users.create).toHaveBeenCalledWith({
        data: {
          id: userId,
          ...createUserDto,
        },
      })
    })

    it('should throw a Warning on error', async () => {
      const createUserDto: CreateUserDto = { username: 'test', password: 'test123' }
      mockPrismaService.users.create.mockRejectedValue(new Error('Error creating user'))

      await expect(userService.create(createUserDto)).rejects.toThrow(Warning)
    })
  })

  describe('find', () => {
    it('should find and return a user by id', async () => {
      const userId = crypto.randomUUID()
      const user = { id: userId, username: 'test', password: 'test123' }
      mockPrismaService.users.findUnique.mockResolvedValue(user)

      const result = await userService.find(userId)
      expect(result).toEqual(user)
    })

    it('should throw a Warning on error', async () => {
      const userId = crypto.randomUUID()
      mockPrismaService.users.findUnique.mockRejectedValue(new Error('Error finding user'))

      await expect(userService.find(userId)).rejects.toThrow(Warning)
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', username: 'user1' }, { id: '2', username: 'user2' }]
      mockPrismaService.users.findMany.mockResolvedValue(users)

      const result = await userService.findAll()
      expect(result).toEqual(users)
    })

    it('should throw a Warning on error', async () => {
      mockPrismaService.users.findMany.mockRejectedValue(new Error('Error listing users'))

      await expect(userService.findAll()).rejects.toThrow(Warning)
    })
  })

  describe('update', () => {
    it('should update and return a user', async () => {
      const userId = crypto.randomUUID()
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' }
      const updatedUser = { id: userId, ...updateUserDto }
      mockPrismaService.users.update.mockResolvedValue(updatedUser)

      const result = await userService.update(userId, updateUserDto)
      expect(result).toEqual(updatedUser)
    })

    it('should throw a Warning on error', async () => {
      const userId = crypto.randomUUID()
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' }
      mockPrismaService.users.update.mockRejectedValue(new Error('Error updating user'))

      await expect(userService.update(userId, updateUserDto)).rejects.toThrow(Warning)
    })
  })

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const userId = crypto.randomUUID()
      mockPrismaService.users.update.mockResolvedValue(undefined)

      await userService.delete(userId)
      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { deleted_at: expect.any(Date) },
      })
    })

    it('should throw a Warning on error', async () => {
      const userId = crypto.randomUUID()
      mockPrismaService.users.update.mockRejectedValue(new Error('Error deleting user'))

      await expect(userService.delete(userId)).rejects.toThrow(Warning)
    })
  })

  describe('login', () => {
    it('should return a user', async () => {
      const loginDto: LoginUserDto = { username: 'test', password: 'test123' }
      const user = { id: crypto.randomUUID(), username: 'test' }
      mockPrismaService.users.findFirst.mockResolvedValue(user)

      const result = await userService.login(loginDto)
      expect(result).toEqual(user)
    })

    it('should throw a Warning on error', async () => {
      const loginDto: LoginUserDto = { username: 'test', password: 'test123' }
      mockPrismaService.users.findFirst.mockRejectedValue(new Error('Error on login'))

      await expect(userService.login(loginDto)).rejects.toThrow(Warning)
    })
  })

  describe('authenticate', () => {
    it('should return a token for a user', async () => {
      const loginDto: LoginUserDto = { username: 'test', password: 'test123' }
      const token = 'mocked-token'
      const user: Users = {
        id: crypto.randomUUID(),
        username: 'test',
        password: 'test',
        deleted_at: null,
        updated_at: null,
        created_at: new Date()
      }

      jest.spyOn(userService, 'login').mockResolvedValue(user)
      jest.spyOn(jwt, 'sign').mockImplementation(() => token)

      const result = await userService.authenticate(loginDto.username, loginDto.password)
      expect(result).toEqual({ token })
    })

    it('should throw a Warning on error', async () => {
      const loginDto: LoginUserDto = { username: 'test', password: 'test123' }
      jest.spyOn(userService, 'login').mockRejectedValue(new Error('Error on login'))

      await expect(userService.authenticate(loginDto.username, loginDto.password)).rejects.toThrow(Warning)
    })
  })

  describe('verifyToken', () => {
    it('should return user data for a valid token', async () => {
      const token = 'valid-token'
      const userId = crypto.randomUUID()
      const user: Users = {
        id: crypto.randomUUID(),
        username: 'test',
        password: 'test',
        deleted_at: null,
        updated_at: null,
        created_at: new Date()
      }
      const payload = { id: userId }

      jest.spyOn(jwt, 'verify').mockImplementation((token, secret) => {
        expect(secret).toBe(process.env.JWT_SECRET_KEY || '')
        return payload
      })

      jest.spyOn(userService, 'find').mockResolvedValue(user)
      jest.spyOn(userService, 'find').mockResolvedValue(user)

      const result = await userService.verifyToken(token)
      expect(result).toEqual({ id: userId, user })
    })

    it('should throw a Warning on error', async () => {
      const token = 'valid-token'
      const userId = crypto.randomUUID()

      jest.spyOn(jwt, 'verify').mockImplementation((token, secret) => {
        expect(secret).toBe(process.env.JWT_SECRET_KEY || '')
        return { id: userId }
      })

      jest.spyOn(userService, 'find').mockRejectedValue(new Error('Error verifying token'))

      await expect(userService.verifyToken(token)).rejects.toThrow(Warning)
    })
  })
})
