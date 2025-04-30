import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5000/api/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookDetails(book_id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${book_id}`);
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}?search=${query}`);
  }
}


