import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const { name, email, password } = registerDto;

    // throw exception if user is already existed.
    const checkUser = await this.checkUser(email);
    if (checkUser) {
      throw new UnprocessableEntityException('User is already existed.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      name,
      password: hashedPassword,
    });

    await user.save();
  }

  async login(loginUserDto: any): Promise<{ accessToken: string }> {
    const checkUser = await this.checkUser(loginUserDto.email);

    if (
      !checkUser ||
      !(await bcrypt.compare(loginUserDto.password, checkUser.password))
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!checkUser.isActive) {
      throw new UnprocessableEntityException('Your account is disable.');
    }

    return {
      accessToken: this.jwtService.sign({
        username: checkUser.email,
        id: checkUser._id,
      }),
    };
  }

  private async checkUser(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email }).exec();
  }
}
