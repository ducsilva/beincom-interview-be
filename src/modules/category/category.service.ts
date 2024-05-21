import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/categroy.schema';
import { Model } from 'mongoose';
import { CategoryQueryDto } from 'base/query/category.query';
import { getPropertiesIfExists, paginate } from 'utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}
  create(name: string) {
    const newCategory = new this.categoryModel({ name });
    return newCategory.save();
  }

  async findAll(query: CategoryQueryDto) {
    const { limit, page, ...rest } = query;
    const skip = (page - 1) * limit || 0;
    const filterParams = getPropertiesIfExists(rest);
    const condition = {
      isDeleted: false,
      ...filterParams,
    };

    const appService = await this.categoryModel
      .find(condition)
      .skip(skip)
      .limit(limit);

    const totalItems = await this.categoryModel.countDocuments(condition);

    return paginate({
      data: appService,
      totalItems,
      page: page,
      limit: limit,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
