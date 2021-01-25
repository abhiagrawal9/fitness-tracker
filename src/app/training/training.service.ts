import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private avaiableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  exerciseChanged = new Subject<Exercise>();

  private runningExercise: Exercise;

  constructor() {}

  getAvaiableExercises(): Exercise[] {
    return this.avaiableExercises.slice();
  }

  startExercise(selectedExerciseId: string): void {
    this.runningExercise = this.avaiableExercises.find((ex) => {
      return ex.id === selectedExerciseId;
    });

    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    }
  }
}
