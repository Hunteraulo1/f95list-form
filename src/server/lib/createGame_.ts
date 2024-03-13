import { GameType } from "../../types/schemas";

export function createGame_({
  id,
  domain = "F95z",
  name,
  version,
  tversion,
  tname = "Traduction",
  status = "EN COURS",
  tags,
  type = "RenPy",
  traductor,
  reader,
  ttype = "Traduction Humaine",
  ac = false,
  link,
  tlink,
  trlink,
}: GameType) {
  let game: GameType = {
    id,
    domain,
    name,
    version,
    tversion,
    tname,
    status,
    tags,
    type,
    traductor,
    reader,
    ttype,
    ac,
    link,
    tlink,
    trlink,
  };

  return game;
}
