import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BlogService } from "../../services/blog.service";
import { CommentService } from "../../services/comment.service";
import { UserService } from "../../services/user.service";
import { LikeService } from "../../services/like.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.css"],
})
export class BlogComponent implements OnInit {
  @Input() blog;
  @Input() isList = false;
  @Output() onDeleteBlog: EventEmitter<any> = new EventEmitter();

  tags: string[];
  comments: any[] = [];
  commentForm: FormGroup;
  isCommentFormSubmitted = false;
  isLoading = false;
  isLoggedIn = false;
  user;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private commentService: CommentService,
    private userService: UserService,
    private likeService: LikeService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ["", [Validators.required]],
    });
    if (this.userService.checkIsLoggedIn()) {
      this.getUserData();
    }

    if (!this.blog) {
      this.route.params.subscribe((params) => {
        const blogId = params.id;
        this.getBlog(blogId);
      });
    }
    if (this.blog) {
      this.setTags();
    }
  }

  get commentFormControls() {
    return this.commentForm.controls;
  }

  getUserData() {
    this.user = this.userService.user;
    this.isLoggedIn = true;
  }

  getBlog(blogId) {
    this.blogService.getBlog(blogId).subscribe(
      (response) => {
        this.blog = response;
        this.setTags();
        this.getComments(blogId);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setTags() {
    this.tags = this.blog.tags.split("|");
  }

  deleteBlog(blogId) {
    this.blogService.deleteBlog(blogId).subscribe(
      (response) => {
        if (this.isList) {
          this.onDeleteBlog.emit(blogId);
        } else {
          this.router.navigateByUrl("/");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getComments(blogId) {
    this.commentService.getBlogComments(blogId).subscribe(
      (response: any[]) => {
        this.comments = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addComment() {
    this.isCommentFormSubmitted = true;
    if (this.commentForm.invalid) {
      return;
    }
    this.isLoading = true;
    const commentData = {
      user: this.user._id,
      blog: this.blog._id,
      ...this.commentForm.value,
    };

    this.commentService.addComment(commentData).subscribe(
      (response) => {
        this.isLoading = false;
        this.isCommentFormSubmitted = false;
        this.commentForm.reset();
        this.comments.push(response);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  deleteComment(commentId) {
    this.commentService.deleteComment(commentId).subscribe(
      (response) => {
        this.toastrService.success("Comment is deleted");
        this.comments = this.comments.filter(
          (comment) => comment._id !== commentId
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleLike(option) {
    if (!this.isLoggedIn) {
      this.toastrService.warning("You should be logged in to like blogs");
    }
    const body = {
      userId: this.user._id,
      blogId: this.blog._id,
    };
    if (option) {
      this.likeService.like(body).subscribe(
        (response) => {
          this.blog.isLiked = true;
          this.blog.likesCount++;
        },
        (error) => {}
      );
    } else {
      this.likeService.unLike(body).subscribe(
        (response) => {
          this.blog.isLiked = false;
          this.blog.likesCount--;
        },
        (error) => {}
      );
    }
  }
}
