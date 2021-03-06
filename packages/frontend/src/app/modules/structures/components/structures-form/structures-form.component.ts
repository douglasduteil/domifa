import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { map } from "rxjs/operators";

import { regexp } from "src/app/shared/validators";
import { departements } from "../../../../shared/departements";
import { StructureService } from "../../services/structure.service";
import { Structure } from "../../structure.interface";

@Component({
  selector: "app-structures-form",
  styleUrls: ["./structures-form.component.css"],
  templateUrl: "./structures-form.component.html"
})
export class StructuresFormComponent implements OnInit {
  public title: string;
  public success: boolean = false;
  public structureForm!: FormGroup;
  public structure: Structure;
  public departements: any;
  public submitted: boolean = false;

  public etapeInscription: number;
  public etapes = [
    "Enregistrement de la structure",
    "Création du compte personnel"
  ];

  public structureInscription = {
    etapeInscription: 0,
    structureId: 0
  };

  constructor(
    private formBuilder: FormBuilder,
    private structureService: StructureService,
    private notifService: ToastrService
  ) {
    this.departements = departements;
    this.etapeInscription = 0;

    this.structure = new Structure();
    this.title = "Inscrivez votre structure sur Domifa";

    this.structureInscription = {
      etapeInscription: 0,
      structureId: 0
    };
  }

  get f() {
    return this.structureForm.controls;
  }

  public ngOnInit() {
    this.structureForm = this.formBuilder.group({
      adresse: [this.structure.adresse, [Validators.required]],
      adresseCourrier: [this.structure.adresseCourrier, []],
      adresseDifferente: [this.structure.adresseCourrier, []],
      agrement: [this.structure.agrement, []],
      capacite: [this.structure.capacite, []],
      codePostal: [
        this.structure.codePostal,
        [Validators.pattern(regexp.postcode), Validators.required]
      ],
      complementAdresse: [this.structure.complementAdresse, []],
      departement: [this.structure.departement, []],
      email: [
        this.structure.email,
        [Validators.required, Validators.pattern(regexp.email)],
        this.validateEmailNotTaken.bind(this)
      ],
      id: [this.structure.id, [Validators.required]],
      nom: [this.structure.nom, [Validators.required]],
      phone: [
        this.structure.phone,
        [Validators.required, Validators.pattern(regexp.phone)]
      ],
      rattachement: [this.structure.rattachement, []],
      responsable: this.formBuilder.group({
        fonction: [this.structure.responsable.fonction, [Validators.required]],
        nom: [this.structure.responsable.nom, [Validators.required]],
        prenom: [this.structure.responsable.prenom, [Validators.required]]
      }),
      structureType: [this.structure.structureType, [Validators.required]],
      ville: [this.structure.ville, [Validators.required]]
    });

    this.structureForm.get("structureType").valueChanges.subscribe(value => {
      this.structureForm.get("agrement").setValidators(null);
      this.structureForm.get("departement").setValidators(null);
      this.structureForm.get("rattachement").setValidators(null);

      if (value === "asso") {
        this.structureForm.get("agrement").setValidators(Validators.required);
        this.structureForm
          .get("departement")
          .setValidators(Validators.required);
      } else if (value === "cias") {
        this.structureForm
          .get("rattachement")
          .setValidators(Validators.required);
      }

      this.structureForm.get("agrement").updateValueAndValidity();
      this.structureForm.get("departement").updateValueAndValidity();
      this.structureForm.get("rattachement").updateValueAndValidity();
    });
  }

  public submitStrucutre() {
    this.submitted = true;

    if (this.structureForm.invalid) {
      Object.keys(this.structureForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.structureForm.get(key)
          .errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log(
              "Key control: " +
                key +
                ", keyError: " +
                keyError +
                ", err value: ",
              controlErrors[keyError]
            );
          });
        }
      });
      this.notifService.error(
        "Veuillez vérifier les champs marqués en rouge dans le formulaire"
      );
    } else {
      this.structureService.create(this.structureForm.value).subscribe(
        (structure: Structure) => {
          this.notifService.success("La structure a bien été enregistrée");

          this.structure = new Structure(structure);
          this.etapeInscription = 1;
          this.structureInscription.etapeInscription = 1;
          this.structureInscription.structureId = structure.id;
        },
        error => {
          this.notifService.error("Veuillez vérifier les champs du formulaire");
        }
      );
    }
  }

  public validateEmailNotTaken(control: AbstractControl) {
    const testEmail = RegExp(regexp.email).test(control.value);
    return testEmail
      ? this.structureService.validateEmail(control.value).pipe(
          map((res: boolean) => {
            return res === false ? null : { emailTaken: true };
          })
        )
      : of(null);
  }
}
