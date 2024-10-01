import { User } from '../schemas/user.schema';

export class UserTransformer {
  public static async resource(user: User): Promise<any> {
    return {
      _id: user._id.toString(), // Ensure _id is a string
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
