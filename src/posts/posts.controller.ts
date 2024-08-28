/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from './postdto/createPostDto';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post('/CreatePost')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  createPost(@Body() CreatePostdto: CreatePostDto) {
    return this.postService.createPost(CreatePostdto);
  }
}
