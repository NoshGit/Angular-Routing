import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';

const ROUTE = [  
    {path:'home', component: WelcomeComponent},
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'**', component: PageNotFoundComponent},  
]

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTE)
  ],
  exports:[RouterModule]
})

export class AppRouterModule { }
