import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  getBlogComments(blogId) {
    const url = this.buildUrl("comment/" + blogId);
    return this.httpClient.get(url);
  }

  addComment(body) {
    const token = this.userService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": token,
      }),
    };
    const url = this.buildUrl("comment");
    return this.httpClient.post(url, body, httpOptions);
  }

  deleteComment(commentId) {
    const token = this.userService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": token,
      }),
    };
    const url = this.buildUrl("comment/" + commentId);
    return this.httpClient.delete(url, httpOptions);
  }

  private buildUrl(url) {
    return environment.paseURL + url;
  }
}
