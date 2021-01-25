import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Exercise } from './exercise.model';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  exSub: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exSub = this.trainingService.exerciseChanged.subscribe(
      (exercise: Exercise) => {
        this.ongoingTraining = exercise ? true : false;
      }
    );
  }

  ngOnDestroy(): void {
    this.exSub.unsubscribe();
  }
}
