import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core-module';
import { AuthRoutingModule } from '@auth/auth-routing-module';
import { Auth } from '@auth/pages/auth/auth';

@NgModule({
  declarations: [Auth],
  imports: [CoreModule, AuthRoutingModule],
})
export class AuthModule {}
