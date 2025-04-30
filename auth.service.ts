import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface LoginResponse {
  success: boolean;
  user_id?: number;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/userslist';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, { username, password })
      .pipe(
        map(response => {
          if (response.success) {
            // Store user info in localStorage or a state management solution
            localStorage.setItem('currentUser', JSON.stringify({
              user_id: response.user_id,
              username: response.username
            }));
          }
          return response.success;
        })
      );
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}
