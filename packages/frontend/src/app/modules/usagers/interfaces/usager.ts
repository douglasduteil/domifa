import { Rdv } from "../interfaces/rdv";
import { AyantDroit } from "./ayant-droit";
import { Decision } from "./decision";
import { Doc } from "./document";
import { Entretien } from "./entretien";
import { LastInteraction } from "./last-interaction";

export class Usager {
  public id: number;
  public nom: string;
  public prenom: string;
  public surnom: string;

  public sexe: string;
  public dateNaissance: Date;
  public villeNaissance: string;

  public email: string;
  public phone: string;

  public structure: number;
  public etapeDemande: number;

  public docs: Doc[];
  public entretien: Entretien;
  public rdv: Rdv;
  public ayantsDroitsExist: boolean;
  public ayantsDroits: AyantDroit[];

  public agent: string;
  public statut: string;

  public historique: string;

  public preference: {
    email: boolean;
    phone: boolean;
    aucun: boolean;
  };

  public lastInteraction: LastInteraction;

  public decision: any;

  public dateNaissancePicker: any;

  constructor(usager?: any) {
    this.id = (usager && usager.id) || 0;

    this.nom = (usager && usager.nom) || null;
    this.prenom = (usager && usager.prenom) || null;
    this.surnom = (usager && usager.surnom) || null;
    this.sexe = (usager && usager.sexe) || "homme";
    this.dateNaissance = (usager && new Date(usager.dateNaissance)) || null;

    this.dateNaissancePicker =
      usager && usager.dateNaissance
        ? {
            day: this.dateNaissance.getDate(),
            month: this.dateNaissance.getMonth() + 1,
            year: this.dateNaissance.getFullYear()
          }
        : {};

    this.villeNaissance = (usager && usager.villeNaissance) || null;

    this.email = (usager && usager.email) || null;
    this.phone = (usager && usager.phone) || null;
    this.docs = (usager && usager.docs) || [];

    this.agent = (usager && usager.agent) || null;

    this.structure = (usager && parseInt(usager.structure, 2)) || 2;
    this.etapeDemande = (usager && parseInt(usager.etapeDemande, 2)) || 0;
    this.historique = (usager && usager.historique) || null;

    this.rdv = (usager && new Rdv(usager.rdv)) || new Rdv({});
    this.lastInteraction =
      (usager && new LastInteraction(usager.lastInteraction)) ||
      new LastInteraction({});

    this.entretien =
      (usager && new Entretien(usager.entretien)) || new Entretien({});

    this.docs = (usager && usager.docs) || [];

    this.ayantsDroitsExist = (usager && usager.ayantsDroitsExist) || false;
    this.ayantsDroits = (usager && usager.ayantsDroits) || [];

    this.preference = (usager && usager.preference) || {
      aucun: false,
      email: false,
      phone: false
    };

    this.decision = (usager && usager.decision) || new Decision({});
  }
}
