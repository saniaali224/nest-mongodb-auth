/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts } from 'src/schemas/post.schema';
import { CreatePostDto } from './postdto/createPostDto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<Posts>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async createPost({ userId, ...CreatePostDto }: CreatePostDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User Not Found', 404);
    }

    const newPost = new this.postModel({ ...CreatePostDto, user: userId });
    const savedPost = await newPost.save();

    await user.updateOne({
      $push: {
        posts: savedPost._id,
      },
    });

    return savedPost;
  }
  findPostById() {}
}
