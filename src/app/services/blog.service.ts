import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserService } from "./user.service";
@Injectable({
  providedIn: "root",
})
export class BlogService {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  addNewBlog(data) {
    const token = this.userService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": token,
      }),
    };
    const url = this.buildUrl("blog");
    const body = {
      blogImage: data.blogImage,
      description: data.description,
      tags: data.tags,
      user: this.userService.user._id,
    };
    return this.httpClient.post(url, body, httpOptions);
  }

  deleteBlog(blogId) {
    const token = this.userService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": token,
      }),
    };
    const url = this.buildUrl("blog/" + blogId);
    return this.httpClient.delete(url, httpOptions);
  }

  getBlogsByUserId() {
    const token = this.userService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": token,
      }),
    };
    const url = this.buildUrl("blog/listByUserId/" + this.userService.user._id);
    return this.httpClient.get(url, httpOptions);
  }

  getBlogs() {
    const userId = this.userService.checkIsLoggedIn() && this.userService.user._id;
    const url = this.buildUrl("blog/" + userId);
    return this.httpClient.get(url);
  }

  getBlog(blogId) {
    const userId = this.userService.checkIsLoggedIn() && this.userService.user._id;
    const url = this.buildUrl(
      "blog/list/" + blogId + "/" + userId
    );
    return this.httpClient.get(url);
  }

  private buildUrl(url) {
    return environment.paseURL + url;
  }
}
