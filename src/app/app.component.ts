import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';

import { AuthService } from './user/auth.service';
import { slideInAnimation } from './app.animation';
import { MessageService } from './messages/message.service';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent {
  
  pageTitle = 'Acme Product Management';
  loading = true;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isMsgDisplayed(): boolean {
    return this.messageService.isDisplayed;
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {
    router.events.subscribe((routeEvent: Event) => {
      this.checkRouterEvent(routeEvent);
    });
  }

  displayMessages(): void {
    this.router.navigate([{ outlets: {popup: ['messages']} }]);
    this.messageService.isDisplayed = true;
  }

  hideMessages(): void {
    this.messageService.isDisplayed = false;
    this.router.navigate([{ outlets: {popup: null} }]);
  }

  checkRouterEvent(routeEvent: Event): void {
    if(routeEvent instanceof NavigationStart){
      this.loading = true;
    }else if(routeEvent instanceof NavigationEnd || 
      routeEvent instanceof NavigationError || 
      routeEvent instanceof NavigationCancel){
        this.loading = false;
    }
  }

  logOut(): void {
    this.authService.logout();
    console.log('Log out');
    this.router.navigateByUrl('/home');
  }
}
