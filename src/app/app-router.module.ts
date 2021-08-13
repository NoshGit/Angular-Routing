import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './user/auth.guard';

import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';

const ROUTE = [  
    {path:'home', component: WelcomeComponent},
    {
      path:'products',
      canLoad:[AuthGuard],
      loadChildren: () =>
      import('./products/product.module')
      .then(m => m.ProductModule)
    },
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
