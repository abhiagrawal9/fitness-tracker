import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Exercise } from '../exercise.model';

import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  exercises: Exercise[] = [];
  @Output() ongoingTraining = new EventEmitter<void>();

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exercises = this.trainingService.getAvaiableExercises();
  }

  onStartTraining(): void {
    this.ongoingTraining.emit();
  }
}
