import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from './book.service';
import { CommonModule } from '@angular/common';
import { Book } from './book.model';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  imports: [CommonModule]
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;
  errorMessage: string | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    
    if (bookId) {
      // Convert string ID to number since backend expects a number
      this.bookService.getBookDetails(+bookId).subscribe({
        next: (data) => {
          this.book = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching book details:', error);
          this.errorMessage = 'Unable to load book details. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      this.book = undefined;
      this.loading = false;
      this.errorMessage = 'No book ID provided.';
    }
  }
}
