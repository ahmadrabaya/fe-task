import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { UserService } from "../../services/user.service";
import { ToastrService } from "ngx-toastr";

interface LoginResponse {
  auth: boolean;
  token: string;
  user: object;
  message: string;
}

class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl) {
    const password = control.get("password").value;
    const confirmPassword = control.get("confirmPassword").value;

    if (password !== confirmPassword) {
      control
        .get("confirmPassword")
        .setErrors({ confirmPassword: true });
    } else {
      return null;
    }
  }
}

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;

  isLoginFormSubmitted = false;
  isRegisterFormSubmitted = false;
  isLoading = false;
  isLoggedIn = false;
  user;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    if (this.userService.checkIsLoggedIn()) {
      this.getUserData();
    }

    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.formBuilder.group(
      {
        name: ["", [Validators.required]],
        avatar: ["", [Validators.required]],
        username: ["", [Validators.required]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }
  get registerFormControls() {
    return this.registerForm.controls;
  }

  getUserData() {
    this.user = this.userService.user;
    this.isLoggedIn = true;
  }

  login() {
    this.isLoginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.userService.login(this.loginForm.value).subscribe(
      (response: LoginResponse) => {
        this.userService.setUserData(response);
        window.location.reload();
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.error(error.error.message);
      }
    );
  }

  register() {
    this.isRegisterFormSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.userService.register(this.registerForm.value).subscribe(
      (response: LoginResponse) => {
        this.userService.setUserData(response);
        window.location.reload();
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.error(error.error.message);
      }
    );
  }

  logout() {
    this.userService.logout();
  }
}
