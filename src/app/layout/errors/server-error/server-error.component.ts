import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {

  reportedError!: boolean;
  errorPercentage: number = 0;
  timer: any;

  constructor() { }

  ngOnInit() {
  }

  checkChanged(event: { checked: boolean; }): void {
    this.reportedError = event.checked;
    this.reportedError ? this.startTimer() : this.stopTimer();
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.errorPercentage += 1;

      if (this.errorPercentage === 100) {
        clearInterval(this.timer);
      }
    }, 30);
  }

  private stopTimer(): void {
    clearInterval(this.timer);
    this.errorPercentage = 0;
  }
}
