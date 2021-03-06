import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { regexp } from "src/app/shared/validators";
import { ERROR_LABELS } from "../../../../shared/errors.labels";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-login",
  styleUrls: ["./login.component.css"],
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public userForm!: FormGroup;

  public returnUrl: string;
  public title: string;
  public hidePassword: boolean;
  public successMessage: string;
  public success: boolean;
  public error: boolean;
  public errorMessage: string;
  public errorLabels: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private authService: AuthService
  ) {
    this.title = "Connexion à DomiFa";
    this.errorMessage = "";
    this.successMessage = "";
    this.hidePassword = true;
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || "/";
    this.success = false;
    this.error = false;
    this.errorLabels = ERROR_LABELS;
  }

  public ngOnInit() {
    this.initForm();
  }

  public initForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.pattern(regexp.email), Validators.required]],
      password: ["", Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  public login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        user => {
          this.success = true;
          this.error = true;
          this.returnUrl !== "/"
            ? this.router.navigateByUrl(this.returnUrl)
            : this.router.navigate(["/manage"]);
        },
        error => {
          this.error = true;
          this.success = false;
          this.errorMessage = this.errorLabels[error.error.message];
        }
      );
  }
}
