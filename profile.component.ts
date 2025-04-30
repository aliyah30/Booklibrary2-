import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Book } from './book.model';
import { BookService } from './book.service';
import { RecommendationService } from './recommendation.service';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, Observable, of } from 'rxjs';

interface User {
  user_id: number;
  name: string;
  email: string;
  username: string;
}

interface Transaction {
  transaction_id: number;
  book_id: number;
  user_id: number;
  borrow_date: string;
  return_date: string | null;
  status: string;
  late_fee: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class ProfileComponent implements OnInit {
  // User will be populated from API
  user: User | null = null;
  isLoading = true;
  errorMessage = '';
  
  borrowingHistory: Book[] = [];
  transactions: Transaction[] = [];
  recommendations = {
    byAuthor: [] as Book[],
    byDate: [] as Book[],
    similar: [] as Book[]
  };

  constructor(
    private bookService: BookService,
    private recommendationService: RecommendationService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user ID from localStorage (set during login)
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      // No user is logged in, redirect to login
      this.errorMessage = 'Please login to view your profile';
      this.router.navigate(['/login']);
      return;
    }
    
    // Convert to number since backend expects a number
    const userIdNum = +userId;
    
    // Fetch user data
    this.fetchUserData(userIdNum);
  }

  fetchUserData(userId: number) {
    this.isLoading = true;
    
    // Fetch user details from API
    this.http.get<User>(`http://localhost:5000/api/users/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user data:', error);
          this.errorMessage = 'Unable to load user profile.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(userData => {
        if (userData) {
          this.user = userData;
          // After getting user data, fetch their transaction history
          this.fetchTransactionHistory(userId);
        } else {
          this.isLoading = false;
        }
      });
  }

  fetchTransactionHistory(userId: number) {
    // Get user's transaction history from API
    this.http.get<Transaction[]>(`http://localhost:5000/api/users/transactions/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching transaction history:', error);
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe(transactions => {
        this.transactions = transactions;
        
        // Extract unique book IDs from transactions
        const bookIds = [...new Set(transactions.map(t => t.book_id))];
        
        if (bookIds.length > 0) {
          this.fetchBookDetails(bookIds);
        } else {
          this.isLoading = false;
          // No books borrowed yet, can't get recommendations
        }
      });
  }

  fetchBookDetails(bookIds: number[]) {
    // Create an array of book detail requests
    const bookRequests: Observable<Book>[] = bookIds.map(bookId => 
      this.bookService.getBookDetails(bookId)
    );
    
    // Use forkJoin to wait for all requests to complete
    if (bookRequests.length > 0) {
      forkJoin(bookRequests)
        .pipe(
          catchError(error => {
            console.error('Error fetching book details:', error);
            this.isLoading = false;
            return of([]);
          })
        )
        .subscribe(books => {
          this.borrowingHistory = books;
          this.isLoading = false;
          
          // Get recommendations based on borrowing history
          if (books.length > 0) {
            this.getRecommendations();
          }
        });
    } else {
      this.isLoading = false;
    }
  }

  private getRecommendations() {
    this.recommendationService.getRecommendations(this.borrowingHistory)
      .pipe(
        catchError(error => {
          console.error('Error fetching recommendations:', error);
          return of({
            byAuthor: [],
            byDate: [],
            similar: []
          });
        })
      )
      .subscribe(recommendations => {
        this.recommendations = recommendations;
      });
  }

  logout() {
    // Clear user data from localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
