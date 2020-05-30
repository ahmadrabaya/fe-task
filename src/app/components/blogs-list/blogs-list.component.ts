import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-blogs-list",
  templateUrl: "./blogs-list.component.html",
  styleUrls: ["./blogs-list.component.css"],
})
export class BlogsListComponent implements OnInit {
  @Input() blogsList: any[] = [];
  @Input() isLoading: boolean;
  blogsOnPage: any[];

  constructor() {}

  ngOnInit() {}

  onChangePage(blogsOnPage: Array<any>) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    this.blogsOnPage = blogsOnPage;
  }

  deleteBlog(blogId) {
    this.blogsList = this.blogsList.filter((blog) => blog._id !== blogId);
  }

}
