import {HttpErrorResponse} from '@angular/common/http';

export function apiErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Cannot reach the backend. Check that it is running and allows this browser origin.';
  }
  if (error.status === 401) {
    return 'Authentication failed. Enter a fresh JWT.';
  }
  if (error.status === 403) {
    return 'Your token does not have permission for this action.';
  }
  return 'The request failed (HTTP ' + error.status + '). Please try again.';
}
