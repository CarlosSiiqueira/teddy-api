import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./user.dto";
import * as crypto from 'crypto'
import { Users } from "@prisma/client";
import * as jwt from 'jsonwebtoken'
import { Warning } from "src/errors";

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
      throw new Warning('Error creating user', 400)
    }
  }

  async find(id: string): Promise<Users> {

    try {

      const user = await this.prisma.users.findUnique({
        where: {
          id,
          deleted_at: null
        }
      })

      return user
    } catch (error) {
      throw new Warning('Error finding user', 400)
    }
  }

  async findAll(): Promise<Users[]> {

    try {

      const users = await this.prisma.users.findMany({
        where: {
          deleted_at: null
        }
      })

      return users

    } catch (error) {
      throw new Warning('Error listing users', 400)
    }

  }

  async update(id: string, data: UpdateUserDto): Promise<Users> {

    try {

      const user = await this.prisma.users.update({
        data: {
          ...data,
          updated_at: new Date()
        },
        where: {
          id,
          deleted_at: null
        }
      })

      return user
    } catch (error) {
      throw new Warning('Error updating user', 400)
    }
  }

  async delete(id: string): Promise<void> {

    try {

      await this.prisma.users.update({
        where: {
          id
        },
        data: {
          deleted_at: new Date()
        }
      })

    } catch (error) {
      throw new Warning('Error deleting user', 400)
    }
  }

  async login(data: LoginUserDto): Promise<Users> {

    try {

      const user = await this.prisma.users.findFirst({
        where: {
          ...data
        }
      })

      return user

    } catch (error) {
      throw new Warning('Error on login', 400)
    }

  }

  async authenticate(username: string, password: string): Promise<{ token: string } | null> {

    try {

      const user = await this.login({ username, password })

      const token = jwt.sign({ id: user.id, username: user.username }, this.secretKey, { expiresIn: '1d' });

      return {
        token
      }

    } catch (error) {
      throw new Warning('Error on authenticate')
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
      throw new Warning('Error verifying token', 400)
    }
  }

}
