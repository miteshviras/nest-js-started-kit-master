import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserTransformer } from 'src/users/transformer/user.transformer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res): Promise<any> {
    await this.authService.register(registerDto);
    return res.status(201).send({ message: 'User register successfully.' });
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res() res,
  ): Promise<{ accessToken: string }> {
    const response = await this.authService.login(loginDto);
    return res.status(200).send(response);
  }

  /**
   * to get current user details from strategy
   * you need to use @UseGuards() decorator with AuthGuard() method as parameter.
   * this will protected your route.
   */
  @Get('user')
  @UseGuards(AuthGuard())
  async getUser(@Req() req, @Res() res) {
    return res.send(await UserTransformer.resource(req.user));
  }
}
