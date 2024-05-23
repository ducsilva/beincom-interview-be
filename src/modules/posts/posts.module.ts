import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './entities/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from 'modules/category/category.module';
import { UsersModule } from 'modules/users/users.module';
import { CloudinaryMulterConfigModule } from 'middleware/CloudinaryMulterConfigModule.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    CategoryModule,
    UsersModule,
    CloudinaryMulterConfigModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
