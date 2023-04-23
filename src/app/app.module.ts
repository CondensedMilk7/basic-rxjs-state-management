import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { TodoState } from './store/todo.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxsModule.forRoot([TodoState]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
