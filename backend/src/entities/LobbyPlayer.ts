import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Lobby } from "./Lobby";
import { User } from "./User";

@Entity()
export class LobbyPlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Lobby)
  lobby!: Lobby;
}
