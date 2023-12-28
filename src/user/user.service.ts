import {
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user-dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user-dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ email, name, password }: CreateUserDTO) {
    // prisma returns a promise, but in return statement
    // the "await" run by default
    return await this.prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    await this.exists(id);

    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  // Update (PUT) always must be change all fields
  // Specific changes, must be made with PATCH
  async update(id: number, data: UpdateUserDTO) {
    await this.exists(id);

    return this.prisma.user.update({
      data: { ...data, birthAt: data.birthAt ? new Date(data.birthAt) : null },
      where: {
        id,
      },
    });
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    // let birthAt = undefined;
    // if (data.birthAt) {
    //   birthAt = new Date(data.birthAt);
    // }
    await this.exists(id);

    return this.prisma.user.update({
      data: {
        ...data,
        birthAt: data.birthAt ? new Date(data.birthAt) : undefined,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new ImATeapotException(`The user ${id} does not exists.`);
    }
  }
}
