
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Repository } from './clone-repo/entities/repository.entity';
import { CloneRepoModule } from './clone-repo/clone-repo.module';

@Module({
  imports: [
    // AuthModule,
    // BoxStateModule,
    CloneRepoModule,

    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: process.env.DB_HOST,
      host: '127.0.0.1',
      port: +process.env.DB_PORT || 3306,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,      
      entities: [
        Repository
      ],
      synchronize: true,
      // ssl: {
      //   rejectUnauthorized: false,
      // }
    }),
    
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname,'..','public'), 
    // }),

  ],
})
export class AppModule {}

/* **************************
***  DATABASE POSTGRESQL  ***
************************** 

type: 'postgres',
host: process.env.DB_HOST,
port: +process.env.DB_PORT,
database: process.env.DB_NAME,
username: process.env.DB_USERNAME,
password: process.env.DB_PASSWORD,      
autoLoadEntities: true,
synchronize: true,

*/