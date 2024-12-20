import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Repository {
    // @PrimaryGeneratedColumn('uuid')
    @Column('varchar', {
        primary: true,
        unique: true,
        length: 255
    })
    reportId: string;
    
    @Column('varchar', {
        unique: true,
        length: 255
    })
    cloneUrl: string;

    @Column('varchar', {
        length: 255
    })
    name: string;

    @Column('varchar', {
        unique: true,
        length: 255
    })
    src: string;
}
