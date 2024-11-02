import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

  constructor(private readonly userService: UserService) { }

  async use(request: Request, response: Response, next: NextFunction) {

    const noAuthRoutes = [
      "/user/login",
      "/user/auth"
    ]

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      let access = false

      noAuthRoutes.map((path) => {

        if (request.path === path) {
          access = true
        }

      })

      if (!access) {
        throw new UnauthorizedException('No authorization header provided')
      }

      return next()
    }

    const token = authHeader.split(' ')[1];
    const user = await this.userService.verifyToken(token)

    try {

      if (!user) {
        throw new UnauthorizedException('Invalid token')
      }

      request.headers = {
        ...request.headers,
        user: JSON.stringify(user.user)
      }

      next();

    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
