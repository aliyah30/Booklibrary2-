import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book ) from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5000/api/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching books:', error);
        return throwError(() => error);
      })
    );
  }

  getBookDetails(book_id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${book_id}`).pipe(
      catchError(error => {
        console.error(`Error fetching book ${book_id}:`, error);
        return throwError(() => error);
      })
    );
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}?search=${query}`).pipe(
      catchError(error => {
        console.error('Error searching books:', error);
        return throwError(() => error);
      })
    );
  }
}
