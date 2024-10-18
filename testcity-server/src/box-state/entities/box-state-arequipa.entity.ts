import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BoxState } from "../config/enum-state-box";

@Entity()
export class ArequipaBoxes {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    boxId: string;

    @Column({
        type:'enum',
        enum: BoxState,
        default: BoxState.Disponible
    })
    status: BoxState;

    @Column('text')
    color: string;

    // @BeforeInsert()
    // checkFieldsBeforeInsert(){
    //     if(this.color)
    // }

    // @BeforeUpdate()
    // checkFieldBeforeUpdate(){
    //     this.checkFieldsBeforeInsert();
    // }
}
