import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { LobbyPlayer } from "./LobbyPlayer";

@Entity()
export class Lobby {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column({ default: "waiting" })
  status!: string;

  @OneToMany(() => LobbyPlayer, (lp) => lp.lobby)
  players!: LobbyPlayer[];
}
