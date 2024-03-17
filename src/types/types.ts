export interface Game {
  domain: "F95z" | "LewdCorner" | "Autre";
  id: number | null;
  name: string;
  link: string;
  status: "EN COURS" | "TERMINÉ" | "ABANDONNÉ";
  tags: string | null;
  type:
    | "RenPy"
    | "RPGM"
    | "Unity"
    | "Unreal"
    | "Flash"
    | "HTLM"
    | "QSP"
    | "Autre"
    | "RenPy/RPGM"
    | "RenPy/Unity";
  version: string;
  tversion: string;
  tname:
    | "Traduction"
    | "Traduction (mod inclu)"
    | "Intégrée"
    | "Pas de traduction";
  tlink: string | null;
  traductor: string | null;
  reader: string | null;
  ttype:
    | "Traduction Humaine"
    | "Traduction Automatique"
    | "Traduction Semi-Automatique"
    | "VO Française"
    | "À tester";
  ac: boolean;
  trlink?: string | null;
}

export interface QueryGame {
  name: string;
  version: string;
}
