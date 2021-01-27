import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  private exercisesSub: Subscription;
  private isLoadingSub: Subscription;
  exercises: Exercise[];
  isLoading = false;

  constructor(
    private trainingService: TrainingService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.isLoadingSub = this.uiService.loadingStateChanged.subscribe(
      (loadingState) => {
        this.isLoading = loadingState;
      }
    );
    this.exercisesSub = this.trainingService.availableExercisesChanged.subscribe(
      (exercises) => {
        this.exercises = exercises;
      }
    );
    this.trainingService.fetchAvaiableExercises();
  }

  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exercisesSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
  }
}
