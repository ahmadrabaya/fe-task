import { Component, OnInit } from "@angular/core";
import { BlogService } from "../../services/blog.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  blogsList: any[] = [];
  isLoading: boolean = false;
  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.getMyBlogs();
  }

  getMyBlogs() {
    this.isLoading = true;
    this.blogService.getBlogs().subscribe(
      (response: any[]) => {
        this.blogsList = response;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
}
