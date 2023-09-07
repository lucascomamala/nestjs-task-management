import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

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

    const user = this.usersRepository.create({ username, password })

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
}
