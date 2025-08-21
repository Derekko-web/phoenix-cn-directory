import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    return this.categoriesService.findAll();
  }
}