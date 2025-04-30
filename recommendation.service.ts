import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Book } from '../book-detail/book.model';
import { BookService } from '../book-detail/book.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  constructor(private bookService: BookService) {}

  getRecommendations(borrowedBooks: Book[]): Observable<{
    byAuthor: Book[],
    byDate: Book[],
    similar: Book[]
  }> {
    return forkJoin({
      allBooks: this.bookService.getBooks(),
      similar: this.getRecommendationsByHistory(borrowedBooks)
    }).pipe(
      map(({ allBooks, similar }) => ({
        byAuthor: this.getBooksByAuthors(allBooks, borrowedBooks),
        byDate: this.getBooksByDate(allBooks, borrowedBooks),
        similar
      }))
    );
  }

  private getRecommendationsByHistory(borrowedBooks: Book[]): Observable<Book[]> {
    return this.bookService.getBooks().pipe(
      map(books =>
        books
          .filter(book => !borrowedBooks.some(b => b.book_id === book.book_id))
          .slice(0, 3)
      )
    );
  }

  private getBooksByAuthors(allBooks: Book[], borrowedBooks: Book[]): Book[] {
    const authors = new Set(borrowedBooks.map(b => b.author));
    return allBooks
      .filter(book =>
        authors.has(book.author) &&
        !borrowedBooks.some(b => b.book_id === book.book_id)
      )
      .slice(0, 3);
  }

  private getBooksByDate(allBooks: Book[], borrowedBooks: Book[]): Book[] {
    const avgDate = this.getAveragePublicationDate(borrowedBooks);
    return allBooks
      .filter(book => !borrowedBooks.some(b => b.book_id === book.book_id))
      .sort((a, b) => {
        const da = new Date(a.publication_date).getTime();
        const db = new Date(b.publication_date).getTime();
        return Math.abs(da - avgDate.getTime()) - Math.abs(db - avgDate.getTime());
      })
      .slice(0, 3);
  }

  private getAveragePublicationDate(books: Book[]): Date {
    const times = books
      .map(b => new Date(b.publication_date).getTime())
      .filter(t => !isNaN(t));
    const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
    return new Date(avg);
  }
}
