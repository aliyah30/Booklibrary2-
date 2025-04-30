import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Book } from '../book-detail/book.model';
import { BookService } from '../book-detail/book.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService;

  constructor(
    private http: HttpClient,
    private bookService: BookService
  ) {}

getRecommendations(borrowedBooks: Book[]): Observable<{
  byAuthor: Book[],
  byDate: Book[],
  similar: Book[]
}> {
  return this.bookService.getBooks().pipe(
    map(allBooks => {
      const byAuthor = this.getBooksByAuthors(allBooks, borrowedBooks);
      const byDate = this.getBooksByDate(allBooks, borrowedBooks);
      const similar = this.getRecommendationsByHistory(allBooks, borrowedBooks);
      return { byAuthor, byDate, similar };
    })
  );
}

private getRecommendationsByHistory(allBooks: Book[], borrowedBooks: Book[]): Book[] {
  return allBooks.filter(book =>
    !borrowedBooks.find(b => b.book_id === book.book_id)
  ).slice(0, 3);
}

  private getBooksByAuthors(allBooks: Book[], borrowedBooks: Book[]): Book[] {
    const authors = new Set(borrowedBooks.map(book => book.author));
    return allBooks.filter(book => 
      authors.has(book.author) && 
      !borrowedBooks.find(b => b.book_id === book.book_id)
    ).slice(0, 3);
  }

  private getBooksByDate(allBooks: Book[], borrowedBooks: Book[]): Book[] {
    const averageDate = this.getAveragePublicationDate(borrowedBooks);
    return allBooks
      .filter(book => 
        !borrowedBooks.find(b => b.book_id === book.book_id)
      )
      .sort((a, b) => {
        const dateA = new Date(a.publication_date || '');
        const dateB = new Date(b.publication_date || '');
        const diffA = Math.abs(dateA.getTime() - averageDate.getTime());
        const diffB = Math.abs(dateB.getTime() - averageDate.getTime());
        return diffA - diffB;
      })
      .slice(0, 3);
  }

  private getAveragePublicationDate(books: Book[]): Date {
    const dates = books
      .map(book => new Date(book.publication_date || ''))
      .filter(date => !isNaN(date.getTime()));
    
    const totalTime = dates.reduce((sum, date) => sum + date.getTime(), 0);
    return new Date(totalTime / dates.length);
  }
}
