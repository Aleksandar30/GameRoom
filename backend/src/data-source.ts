import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Lobby } from "./entities/Lobby";
import { LobbyPlayer } from "./entities/LobbyPlayer";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "game_room",
  synchronize: true,
  logging: false,
  entities: [User, Lobby, LobbyPlayer],
});
