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
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  exercises: Exercise[] = [];

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

  completeExercise(): void {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    console.log(this.exercises);
  }

  cancelExercise(progress: number): void {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    console.log(this.exercises);
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises(): Exercise[] {
    return this.exercises.slice();
  }
}
