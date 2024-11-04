import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto'
import { Users } from '@prisma/client'
import { NotFoundException } from '@nestjs/common'

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            authenticate: jest.fn(),
          },
        },
      ],
    }).compile()

    userController = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(userController).toBeDefined()
  })

  describe('create', () => {
    it('should create a user and return a success message', async () => {
      const createUserDto: CreateUserDto = { username: 'testuser', password: 'testpass' }
      jest.spyOn(userService, 'create').mockResolvedValue('User created successfully')

      expect(await userController.create(createUserDto)).toBe('User created successfully')
      expect(userService.create).toHaveBeenCalledWith(createUserDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: Users[] = [{
        id: '1',
        username: 'testuser',
        password: 'testpass',
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      }]
      jest.spyOn(userService, 'findAll').mockResolvedValue(users)

      expect(await userController.findAll()).toEqual(users)
      expect(userService.findAll).toHaveBeenCalled()
    })
  })

  describe('find', () => {
    it('should return a user by ID', async () => {
      const user: Users = {
        id: '1',
        username: 'testuser',
        password: 'testpass',
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      }
      jest.spyOn(userService, 'find').mockResolvedValue(user)

      expect(await userController.find('1')).toEqual(user)
      expect(userService.find).toHaveBeenCalledWith('1')
    })

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(userService, 'find').mockResolvedValue(null)

      await expect(userController.find('1')).rejects.toThrow(NotFoundException)
      expect(userService.find).toHaveBeenCalledWith('1')
    })
  })

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' }
      const updatedUser: Users = {
        id: '1',
        username: 'testuser',
        password: 'testpass',
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      }
      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser)

      expect(await userController.update('1', updateUserDto)).toEqual(updatedUser)
      expect(userService.update).toHaveBeenCalledWith('1', updateUserDto)
    })

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(userService, 'update').mockResolvedValue(null)
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' }

      await expect(userController.update('1', updateUserDto)).rejects.toThrow(NotFoundException)
      expect(userService.update).toHaveBeenCalledWith('1', updateUserDto)
    })
  })

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      jest.spyOn(userService, 'delete').mockResolvedValue(undefined)

      await userController.delete('1')
      expect(userService.delete).toHaveBeenCalledWith('1')
    })
  })

  describe('auth', () => {
    it('should return an auth token if login is successful', async () => {
      const loginUserDto: LoginUserDto = { username: 'testuser', password: 'testpass' }
      const token = { token: 'jwt-token' }
      jest.spyOn(userService, 'authenticate').mockResolvedValue(token)

      expect(await userController.auth(loginUserDto)).toEqual(token)
      expect(userService.authenticate).toHaveBeenCalledWith(loginUserDto.username, loginUserDto.password)
    })

    it('should return null if login fails', async () => {
      const loginUserDto: LoginUserDto = { username: 'testuser', password: 'wrongpass' }
      jest.spyOn(userService, 'authenticate').mockResolvedValue(null)

      expect(await userController.auth(loginUserDto)).toBeNull()
      expect(userService.authenticate).toHaveBeenCalledWith(loginUserDto.username, loginUserDto.password)
    })
  })
})