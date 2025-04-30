import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BookService } from './book.service';
import { CommonModule } from '@angular/common';
import { Book } from './book.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
    imports: [CommonModule]
    
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.bookService.getBookDetails(bookId).subscribe(data => {
        this.book = data;
      });
    }
    else {
      this.book = undefined;
    }
  }
}
