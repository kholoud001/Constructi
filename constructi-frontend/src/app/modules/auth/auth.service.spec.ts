import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AppStateService } from '../../shared/services/app-state.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let appStateServiceSpy: jasmine.SpyObj<AppStateService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    appStateServiceSpy = jasmine.createSpyObj('AppStateService', ['setAuthenticated']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: AppStateService, useValue: appStateServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
    localStorage.removeItem('token'); // Clear localStorage after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return token from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');
    expect(service.getToken()).toBe('mockToken');
  });

  it('should return null if token is missing', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(service.getToken()).toBeNull();
  });

  it('should remove token from localStorage', () => {
    spyOn(localStorage, 'removeItem').and.callThrough();
    service.removeToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should authenticate user after login', () => {
    const mockResponse = { token: 'mockJwtToken' };
    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call router navigate and remove token on logout', () => {
    spyOn(localStorage, 'removeItem').and.callThrough();
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(appStateServiceSpy.setAuthenticated).toHaveBeenCalledWith(false);
  });

  it('should return true for isAuthenticated if token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false for isAuthenticated if token is missing', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should decode token correctly', () => {
    const mockDecodedToken = { sub: 'testUser', exp: Date.now() / 1000 + 60 };
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');
    spyOn(window as any, 'jwtDecode').and.returnValue(mockDecodedToken);
    expect(service.getDecodedToken()).toEqual(mockDecodedToken);
  });

  it('should return null for expired token', () => {
    const expiredToken = { sub: 'testUser', exp: Date.now() / 1000 - 60 };
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');
    spyOn(window as any, 'jwtDecode').and.returnValue(expiredToken);
    expect(service.getDecodedToken()).toBeNull();
  });

  it('should send forgot password request', () => {
    service.forgotPassword('test@example.com').subscribe(response => {
      expect(response).toEqual('Password reset link sent');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/auth/forgot-password`);
    expect(req.request.method).toBe('POST');
    req.flush('Password reset link sent');
  });

  it('should send reset password request', () => {
    service.resetPassword('resetToken', 'newPass', 'test@example.com').subscribe(response => {
      expect(response).toEqual('Password successfully reset');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/auth/reset-password`);
    expect(req.request.method).toBe('POST');
    req.flush('Password successfully reset');
  });

  // it('should register a new user', () => {
  //   const userData = {
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     cell: '123456789',
  //     email: 'john@example.com',
  //     password: 'password123',
  //     rateHourly: 20,
  //     contratType: 'FULL_TIME'
  //   };
  //
  //   service.register(userData).subscribe(response => {
  //     expect(response).toEqual('User registered successfully');
  //   }
  //   );
  //
  //   const req = httpMock.expectOne(`${service['apiUrl']}/admin/register`);
  //   expect(req.request.method).toBe('POST');
  //   req.flush('User registered successfully');
  // });

  it('should return username from decoded token', () => {
    const mockDecodedToken = { sub: 'testUser' };
    spyOn(service, 'getDecodedToken').and.returnValue(mockDecodedToken);
    expect(service.getUserName()).toBe('testUser');
  });

  it('should return user role from decoded token', () => {
    const mockDecodedToken = { role: 'admin' };
    spyOn(service, 'getDecodedToken').and.returnValue(mockDecodedToken);
    expect(service.getUserRole()).toBe('admin');
  });
});
