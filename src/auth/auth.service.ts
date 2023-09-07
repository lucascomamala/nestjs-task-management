import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'

import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    // Hash the password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    })

    try {
      await this.usersRepository.save(user)
    } catch (error) {
      // Error code for duplicate username
      if (error.code === '23505') {
        throw new ConflictException('Username already exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto

    const user = await this.usersRepository.findOneBy({ username })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (await bcrypt.compare(password, user.password)) {
      return 'Success'
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }
}
