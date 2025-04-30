import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Book } from '../book-detail/book.model';
import { BookService } from '../book-detail/book.service';
import { RecommendationService } from '../services/recommendation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class ProfileComponent implements OnInit {
  user = {
    username: 'john_doe',
    name: 'John Doe',
    email: 'john@example.com',
    borrowingHistory: ['1', '2']
  };
  
  borrowingHistory: Book[] = [];
  recommendations = {
    byAuthor: [] as Book[],
    byDate: [] as Book[],
    similar: [] as Book[]
  };

  constructor(
    private bookService: BookService,
    private recommendationService: RecommendationService
  ) {}

  ngOnInit(): void {
    this.fetchBorrowingHistory();
  }

  fetchBorrowingHistory() {
    const bookIds = this.user.borrowingHistory;
    const bookRequests = bookIds.map(bookId => 
      this.bookService.getBookDetails(bookId)
    );

    // Wait for all book details to be fetched before getting recommendations
    Promise.all(bookRequests.map(request => 
      request.toPromise()
    )).then(books => {
      this.borrowingHistory = books.filter(book => book !== undefined) as Book[];
      this.getRecommendations();
    });
  }

  private getRecommendations() {
    this.recommendationService.getRecommendations(this.borrowingHistory)
      .subscribe(recommendations => {
        this.recommendations = recommendations;
      });
  }
}  
