import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  // At least one uppercase letter, one lowercase letter, and one number or one special character
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9!@#$%^&*()_+{}[\]:;<>,.?~\\-]).+$/,
    {
      message:
        'Password must include one lower case letter, one upper case letter, and one numeric digit or special character',
    },
  )
  password: string
}
