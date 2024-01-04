import { ImATeapotException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ email, name, password }: CreateUserDTO) {
    const encryptedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(),
    );

    // prisma returns a promise, but in return statement
    // the "await" run by default
    return this.prisma.user.create({
      data: {
        email,
        name,
        password: encryptedPassword,
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

    const encryptedPassword = await bcrypt.hash(
      data.password,
      await bcrypt.genSalt(),
    );

    return this.prisma.user.update({
      data: {
        ...data,
        password: encryptedPassword,
        birthAt: data.birthAt ? new Date(data.birthAt) : null,
      },
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

    let encryptedPassword: string = null;
    if (data.password) {
      encryptedPassword = await bcrypt.hash(
        data.password,
        await bcrypt.genSalt(),
      );
    }

    return this.prisma.user.update({
      data: {
        ...data,
        password: encryptedPassword ? encryptedPassword : data.password,
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
      // TODO: Make a publication in LinkedIn about 418 error (teapot)
      throw new ImATeapotException(`The user ${id} does not exists.`);
    }
  }
}
