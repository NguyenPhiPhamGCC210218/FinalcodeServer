import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chat_id: number;

  @Column()
  sender: number;

  @Column()
  receiver: number;

  @Column()
  content: string;

  @Column()
  date: Date;
}
