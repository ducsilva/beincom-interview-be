import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { Role, Roles } from '../../config/role';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryQueryDto } from 'base/query/category.query';

@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({
    summary: 'User create category',
  })
  async create(@Body() createPostDto: CreateCategoryDto) {
    const { name } = createPostDto;

    return this.categoryService.create(name);
  }

  @Roles(Role.USER)
  @Get()
  @ApiOperation({
    summary: 'Get all category',
  })
  async getAllPost(@Query() query: CategoryQueryDto) {
    return await this.categoryService.findAll(query);
  }
}
