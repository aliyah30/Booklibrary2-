import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Book } from './book.model';

interface Recommendations {
  byAuthor: Book[];
  byDate: Book[];
  similar: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'http://localhost:5000/api/books';

  constructor(private http: HttpClient) {}

  /**
   * Gets book recommendations based on user's borrowing history
   */
  getRecommendations(borrowedBooks: Book[]): Observable<Recommendations> {
    // If there's no borrowing history, return empty recommendations
    if (!borrowedBooks || borrowedBooks.length === 0) {
      return of({ byAuthor: [], byDate: [], similar: [] });
    }

    // Extract authors from borrowed books
    const authors = [...new Set(borrowedBooks.map(book => book.author))];
    
    // Extract publication years to find books from similar time periods
    const publicationYears = borrowedBooks
      .map(book => new Date(book.publication_date).getFullYear())
      .filter(year => !isNaN(year));
    
    // Get average publication year
    const avgYear = publicationYears.length > 0 ? 
      Math.round(publicationYears.reduce((sum, year) => sum + year, 0) / publicationYears.length) : 
      null;
    
    // Create a year range (±5 years from average)
    const yearRange = avgYear ? [avgYear - 5, avgYear + 5] : null;
    
    // Get all books to filter for recommendations
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching recommendations:', error);
        return of([]);
      }),
      // Create recommendation categories
      (books$) => new Observable<Recommendations>(observer => {
        books$.subscribe(allBooks => {
          // Books by same authors but not already borrowed
          const byAuthor = allBooks.filter(book => 
            authors.includes(book.author) && 
            !borrowedBooks.some(borrowed => borrowed.book_id === book.book_id)
          );
          
          // Books from similar time periods
          const byDate = yearRange ? 
            allBooks.filter(book => {
              const bookYear = new Date(book.publication_date).getFullYear();
              return !isNaN(bookYear) && 
                bookYear >= yearRange[0] && 
                bookYear <= yearRange[1] &&
                !borrowedBooks.some(borrowed => borrowed.book_id === book.book_id) &&
                !byAuthor.some(authorBook => authorBook.book_id === book.book_id);
            }) : [];
          
          // Pick some other books not already recommended
          const similar = allBooks.filter(book => 
            !borrowedBooks.some(borrowed => borrowed.book_id === book.book_id) &&
            !byAuthor.some(authorBook => authorBook.book_id === book.book_id) &&
            !byDate.some(dateBook => dateBook.book_id === book.book_id)
          ).slice(0, 5); // Limit to 5 recommendations
          
          observer.next({ 
            byAuthor: byAuthor.slice(0, 5), // Limit to 5 recommendations
            byDate: byDate.slice(0, 5),     // Limit to 5 recommendations
            similar 
          });
          observer.complete();
        });
      })
    );
  }
}
