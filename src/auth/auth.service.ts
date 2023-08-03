import { ForbiddenException, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service'; // TODO : prisma
import { EntityManager, Repository } from 'typeorm';
import { UserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  // TODO : prisma
  constructor(
    // private prisma: PrismaService,
    @InjectRepository(User)
    private readonly itemsRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService
  ) { }

  // Returns Promise of type Tokens that we defined
  async signupLocal(dto: UserDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = new User({
      email: dto.email,
      hash: hash,
    });

    await this.entityManager.save(newUser);

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(dto: UserDto): Promise<Tokens> {
    const user = await this.itemsRepository.findOneBy({ email: dto.email });

    if (!user) throw new ForbiddenException("Access Denied");

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException("Access Denied");

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    // TODO : might be able to make this a transaction
    // TODO : should only do this if hashed token is null
    var user = await this.itemsRepository.findOneBy({ id: userId });
    user.hashedRt = null;
    await this.entityManager.save(user);
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.itemsRepository.findOneBy({ id: userId });
    if (!user || !user.hashedRt) throw new ForbiddenException("Access Denied");

    const rtMatches = bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException("Access Denied");

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(user: User, rt: string) {
    const hash = await this.hashData(rt);
    // This is taking the whole existing user, updating just the refresh token, and saving it
    // probably better to just update just the rt hash via id column.
    user.hashedRt = hash;
    await this.entityManager.save(user);
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  // args is info we want to put in JWT
  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret', // match with at.strategy.ts
          expiresIn: 60 * 15, // 15 mins
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret', // match with at.strategy.ts
          expiresIn: 60 * 60 * 24 * 7, // 1 week
        }
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    }
  }

}
