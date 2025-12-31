import { Component } from '@angular/core';
import { Timeline } from './components/timeline/timeline';

@Component({
  selector: 'app-root',
  imports: [Timeline],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
  
