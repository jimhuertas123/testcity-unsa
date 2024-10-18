import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoxStateService } from './box-state.service';
import { UpdateBoxStateDto } from './dto/update-box-state.dto';

@Controller('box-state')
export class BoxStateController {
  constructor(private readonly boxStateService: BoxStateService) {}

  @Patch('/arequipa')
  updateArequipa(@Body() updateBoxStateDto: UpdateBoxStateDto) {
    return this.boxStateService.changeStateInBoxArequipa(updateBoxStateDto);
  }

  @Patch('/lima')
  updateLima(@Body() updateBoxStateDto: UpdateBoxStateDto) {
    return this.boxStateService.changeStateInBoxArequipa(updateBoxStateDto);
  }

  @Get('/init')
  initBoxSeed(){
    return this.boxStateService.addNewBox();
  }

}
