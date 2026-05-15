import { Component, OnInit } from '@angular/core';
import { GreetingService } from './greeting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  greeting = '';

  constructor(private greetingService: GreetingService) {}

  ngOnInit(): void {
    this.greetingService.getGreeting().subscribe(text => this.greeting = text);
  }
}