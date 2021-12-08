import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationResultStatus, AuthorizeService, FailureAuthenticationResult, IAuthenticationResult, IUser } from './authorize.service';

@Injectable({
  providedIn: 'root'
})
export class FakeAuthorizeService extends AuthorizeService {
  private static readonly DUMMY_USER: IUser = { name: 'Weather Worker' };

  private fakeSignIn(state: any): Promise<IAuthenticationResult> {
    return Promise.resolve({ status: AuthenticationResultStatus.Success, state });
  }

  private fakeSignOut(): Promise<IAuthenticationResult> {
    const logoutErrorResponse: FailureAuthenticationResult =
    { status: AuthenticationResultStatus.Fail, message: 'Cannot log out with a fake auth service.' };
    return Promise.resolve(logoutErrorResponse);
  }
  public getUser(): Observable<IUser | null> {
    return of<IUser>(FakeAuthorizeService.DUMMY_USER);
  }

  public getAccessToken(): Observable<string> {
    return of('fake-access-token');
  }

  public signIn(state: any): Promise<IAuthenticationResult> {
    return this.fakeSignIn(state);
  }

  public completeSignIn(_url: string): Promise<IAuthenticationResult> {
    return this.fakeSignIn(FakeAuthorizeService.DUMMY_USER);
  }

  public signOut(state: any): Promise<IAuthenticationResult> {
    return this.fakeSignOut();
  }

  public completeSignOut(_url: string): Promise<IAuthenticationResult> {
    return this.fakeSignOut();
  }
}