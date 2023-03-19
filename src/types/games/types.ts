export interface GameStructure {
  game: string;
  avatar: string;
  date: Date | string;
  hour: string;
  bio: string;
  plazasLibres: number;
  id: string;
  createdBy: string;
}

export type GamesStructure = GameStructure[];
