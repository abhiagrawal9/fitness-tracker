import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private runningExercise: Exercise;
  private avaiableExercises: Exercise[] = [];
  private firebaseSubs: Subscription[] = [];
  exerciseChanged = new Subject<Exercise>();
  availableExercisesChanged = new Subject<Exercise[]>();
  completedOrCancelledExercisesChanged = new Subject<Exercise[]>();

  constructor(private db: AngularFirestore, private uiService: UiService) {}

  fetchAvaiableExercises(): void {
    this.uiService.loadingStateChanged.next(true);
    this.firebaseSubs.push(
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
        .subscribe(
          (exercises: Exercise[]) => {
            this.uiService.loadingStateChanged.next(false);
            this.avaiableExercises = exercises;
            this.availableExercisesChanged.next([...this.avaiableExercises]);
          },
          () => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              'Unable to fetch exercises. An Error occured!',
              'Cancel',
              3000
            );
            this.availableExercisesChanged.next(null);
          }
        )
    );
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
    this.addFinishedExercisesToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number): void {
    this.addFinishedExercisesToDatabase({
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

  fetchCompletedOrCancelledExercises(): void {
    this.firebaseSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((finishedExercises: Exercise[]) => {
          this.completedOrCancelledExercisesChanged.next(finishedExercises);
        })
    );
  }

  addFinishedExercisesToDatabase(exercise: Exercise): void {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions(): void {
    this.firebaseSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
