import { HttpContextToken } from '@angular/common/http';

/** wird gesetzt, wenn die Anwndung Dinge im Hintergrund nachladen will.  */
export const SILENT_LOAD_CONTEXT = new HttpContextToken(() => false);

/** https://angular.io/api/common/http/HttpContext */

/** wird auf true gesetzt, wenn es einen effect gibt, der eine Fehlermeldung anzeigt. Dann unterbleibt das parallele Anzeigen der Fehlermeldung durch den globalErrorEinterceptor.*/
export const ERROR_MESSAGE_HANDLED_LOCALLY = new HttpContextToken<boolean>(() => false);
