import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true })
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
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
        this.logger.error(
          `Failed to create user "${username}". Data: ${JSON.stringify(
            authCredentialsDto,
          )}`,
          error.stack,
        )
        throw new InternalServerErrorException()
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto

    const user = await this.usersRepository.findOneBy({ username })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = { username }
      const accessToken: string = await this.jwtService.sign(payload)
      return { accessToken }
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }
}
