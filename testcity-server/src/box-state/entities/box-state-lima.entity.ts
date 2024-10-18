import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BoxState } from "../config/enum-state-box";

@Entity()
@Unique(["boxId"])
export class LimaBoxes {

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
    //     this.color
    // }

    // @BeforeUpdate()
    // checkFieldBeforeUpdate(){
    //     this.checkFieldsBeforeInsert();
    // }
}
