import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BlogService } from "../../services/blog.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  newBlogForm: FormGroup;
  isNewBlogFormSubmitted: boolean;
  isLoading: boolean;
  isLoadingGetBlogs: boolean;
  blogsList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.newBlogForm = this.formBuilder.group({
      blogImage: ["", [Validators.required]],
      tags: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });
    this.getMyBlogs();
  }

  get newBlogFormControls() {
    return this.newBlogForm.controls;
  }

  getMyBlogs() {
    this.isLoadingGetBlogs = true;
    this.blogService.getBlogsByUserId().subscribe(
      (response: any[]) => {
        this.blogsList = response;
        this.isLoadingGetBlogs = false;
      },
      (error) => {
        this.isLoadingGetBlogs = false;
        console.log(error);
      }
    );
  }

  addBlog() {
    this.isNewBlogFormSubmitted = true;
    if (this.newBlogForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.blogService.addNewBlog(this.newBlogForm.value).subscribe(
      (response) => {
        this.isLoading = false;
        this.newBlogForm.reset();
        this.isNewBlogFormSubmitted = false;
        this.toastrService.success("Blog is added successfully");
        this.blogsList = [response, ...this.blogsList];
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.error("Some thing is wrong please try again");
      }
    );
  }
}
