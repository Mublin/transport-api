import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>){}
  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findAll() {
    return this.userModel.find().select("-password").exec();
  }
  findProfile(id: string) {
    return this.userModel.findById(id).select("-password");
  }
  findOne(id: string) {
    return this.userModel.findById(id);
  }
  findByEmail(email: string) {
    return this.userModel.findOne({email: email}).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  remove(id: string) {
    return this.userModel.deleteOne({_id: id});
  }
  updateRefreshToken(id: string, token: string) {
    return this.userModel.findByIdAndUpdate(id, {refreshToken: token}).exec();
  }
  async findNearbyDrivers(longitude: number, latitude: number, maxDistance: number): Promise<User[]> {
    return this.userModel.find({
      role: 'driver',
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance, // In meters
        },
      },
    }).exec();
  }

  async updateLocation(userId: string, longitude: number, latitude: number): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { location: { type: 'Point', coordinates: [longitude, latitude] } } },
    );
  }

  async updateAvailability(userId: string, isAvailable: boolean): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $set: { isAvailable } });
  }
}
