import { Injectable } from '@angular/core';
import {CanDeactivate } from '@angular/router';
import {DeactivationGuarded} from '../models/compliance-guard';
import { Observable ,Subject } from 'rxjs';
  
@Injectable()
export class CanDeactivateGuard implements CanDeactivate <DeactivationGuarded>{
  canDeactivate(component: DeactivationGuarded):  Observable<boolean>| Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();
}