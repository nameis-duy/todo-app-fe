import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConstant } from '../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private message = new BehaviorSubject<string>('');
  message$ = this.message.asObservable();

  userNameStoringKey = AppConstant.USER_NAME_STORING_KEY;

  ngOnInit() {
    this.message.next(localStorage.getItem(this.userNameStoringKey)!);
  }

  sendMessage(message: string) {
    this.message.next(message);
  }
}
