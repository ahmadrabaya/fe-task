import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  user;
  token;
  constructor(private httpClient: HttpClient) {}

  checkIsLoggedIn() {
    this.user = JSON.parse(window.localStorage.getItem("user"));
    this.token = window.localStorage.getItem("token");
    return this.user && this.token;
  }

  setUserData(data) {
    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("user", JSON.stringify(data.user));
    this.user = data.user;
    this.token = data.token;
  }

  login(data) {
    const url = this.buildUrl("login");
    const body = {
      username: data.username,
      password: data.password,
    };
    return this.httpClient.post(url, body);
  }

  register(data) {
    const url = this.buildUrl("register");
    const body = {
      name: data.name,
      avatar: data.avatar,
      username: data.username,
      password: data.password,
    };
    return this.httpClient.post(url, body);
  }

  logout() {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("token");
    window.location.reload();
  }

  private buildUrl(url) {
    return environment.paseURL + url;
  }
}
