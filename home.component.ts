import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Book } from '../book-detail/book.model';
import { BookService } from '../book-detail/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink]
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  books: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
    }); // Fetch books when the component loads
  }

  searchBooks() {
    this.bookService.searchBooks(this.searchQuery).subscribe(data => {
      this.books = data;
    });
  }
}
