import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class LikeService {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  like(body) {
    const token = this.userService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": token,
      }),
    };
    const url = this.buildUrl("like/like");
    return this.httpClient.post(url, body, httpOptions);
  }

  unLike(body) {
    const token = this.userService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": token,
      }),
    };
    const url = this.buildUrl("like/unlike");
    return this.httpClient.post(url, body, httpOptions);
  }

  private buildUrl(url) {
    return environment.paseURL + url;
  }
}
