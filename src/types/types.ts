export interface Game {
  domain: "F95z" | "LewdCorner" | "Autre";
  id: string | null;
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
    | "Traduction (mod inclus)"
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

export interface Traductor {
  name: string;
  links?: {
    name: string;
    link: string;
  }[];
}
