import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./user.dto";
import crypto from 'crypto'
import { Users } from "@prisma/client";
import jwt from 'jsonwebtoken'

@Injectable()
export class UserService {


  private readonly secretKey: string

  constructor(
    private readonly prisma: PrismaService,

  ) {
    this.secretKey = process.env.JWT_SECRET_KEY || ''
  }

  async create(data: CreateUserDto): Promise<string> {

    try {

      const id = crypto.randomUUID()

      await this.prisma.users.create({
        data: {
          id,
          ...data
        }
      })

      return id
    } catch (error) {

    }
  }

  async find(id: string): Promise<Users> {

    const user = await this.prisma.users.findUnique({
      where: {
        id
      }
    })

    return user
  }

  async findAll(): Promise<Users[]> {

    return await this.prisma.users.findMany({
      where: {
        deleted_at: null
      }
    })

  }

  async update(id: string, data: UpdateUserDto): Promise<Users> {


    const user = await this.prisma.users.update({
      data: {
        ...data
      },
      where: {
        id
      }
    })

    return user
  }

  async delete(id: string): Promise<void> {

    await this.prisma.users.update({
      where: {
        id
      },
      data: {
        deleted_at: new Date()
      }
    })
  }

  async login(data: LoginUserDto): Promise<Users> {

    return await this.prisma.users.findFirst({
      where: {
        ...data
      }
    })

  }

  async authenticate(username: string, password: string): Promise<{
    userId: string,
    token: string
  } | null> {

    const user = await this.login({ username, password })

    const token = jwt.sign({ id: user.id, username: user.username }, this.secretKey, { expiresIn: '1d' });

    return {
      userId: user.id,
      token
    }
  }

  async verifyToken(token: string): Promise<{ id: string, user: Users } | null> {

    try {
      const payload = jwt.verify(token, this.secretKey) as { id: string };
      const user = await this.find(payload.id)

      if (user) {
        return { id: payload.id, user: user };
      }

      return null

    } catch (error) {
      return null;
    }
  }

}
