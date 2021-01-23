import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training/stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: any;

  constructor(private dialog: MatDialog) {}
  @Output() exitTraining = new EventEmitter<void>();

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer(): void {
    this.timer = setInterval(() => {
      this.progress += 1;
      if (this.progress === 100) {
        clearInterval(this.timer);
      }
    }, 500);
  }

  onStop(): void {
    clearInterval(this.timer);
    console.log(this.progress);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.exitTraining.emit();
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
