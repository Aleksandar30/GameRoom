import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Question } from "./entities/Question";
// import { Lobby } from "./entities/Lobby";
// import { LobbyPlayer } from "./entities/LobbyPlayer";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "game_room",
  synchronize: true,
  // dropSchema: true, // Koristi se za resetovanje baze
  logging: false,
  entities: [User, Question],
});
