import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Question } from "./entities/Question";
// import { Lobby } from "./entities/Lobby";
// import { LobbyPlayer } from "./entities/LobbyPlayer";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "1",
  database: "game_room",
  synchronize: true,
  // dropSchema: true, // Koristi se za resetovanje baze
  logging: false,
  entities: [User, Question],
});
