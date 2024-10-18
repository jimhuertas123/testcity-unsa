import { Injectable } from '@nestjs/common';
import { UpdateBoxStateDto } from './dto/update-box-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArequipaBoxes } from './entities/box-state-arequipa.entity';
import { Repository } from 'typeorm';
import { LimaBoxes } from './entities/box-state-lima.entity';
import { BoxState } from './config/enum-state-box';
import  {v4 as uuid}  from "uuid";

@Injectable()
export class BoxStateService {
  constructor(
    @InjectRepository(ArequipaBoxes)
    private readonly arequipaBoxRepository: Repository<ArequipaBoxes>,
    
    @InjectRepository(LimaBoxes)
    private readonly limaBoxRepository: Repository<LimaBoxes>,
  ){}

  //Solo temporal (boxes deben añadirse por defecto no pueden ingresar uno mas del rango de 372 tano aqp como lima) 
  async addNewBox(){
    for (let i = 1; i < 373; i++) {
      const newArequipaBox = this.arequipaBoxRepository.create({
        id: uuid(),
        boxId: `BOX-${i}`,
        status: BoxState.Disponible,
        color: this.getColorForStatus(BoxState.Disponible),
      });
      const newLimaBox = this.arequipaBoxRepository.create({
        id: uuid(),
        boxId: `BOX-${i}`,
        status: BoxState.Disponible,
        color: this.getColorForStatus(BoxState.Disponible),
      });

      try {
        await this.arequipaBoxRepository.save(newArequipaBox);
        await this.limaBoxRepository.save(newLimaBox);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async changeStateInBoxArequipa(updateBoxStateDto: UpdateBoxStateDto) {
    const boxFound = await this.arequipaBoxRepository.findOne({ where: { boxId: updateBoxStateDto.boxId } });
    if (!boxFound) {
      throw new Error('Asiento no encontrado!');
    }

    boxFound.status = updateBoxStateDto.state;
    boxFound.color = this.getColorForStatus(updateBoxStateDto.state);


    return this.arequipaBoxRepository.save(boxFound);

  }

  getColorForStatus(status: BoxState): string {
    const statusColorMap = {
      SEPARADO: 'yellow',
      DISPONIBLE: 'green',
      BLOQUEADO: 'red',
      VENDIDO: 'gray',
    };

    return statusColorMap[status];
  }
}
