import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private avaiableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  availableExercisesChanged = new Subject<Exercise[]>();
  completedOrCancelledExercises: Exercise[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvaiableExercises(): void {
    this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((document) => {
            return {
              id: document.payload.doc.id,
              ...(document.payload.doc.data() as Exercise),
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.avaiableExercises = exercises;
        this.availableExercisesChanged.next([...this.avaiableExercises]);
      });
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
    this.completedOrCancelledExercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number): void {
    this.completedOrCancelledExercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises(): Exercise[] {
    return this.completedOrCancelledExercises.slice();
  }
}
