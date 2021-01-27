import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss'],
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private finishedExercisesSub: Subscription;
  datasource = new MatTableDataSource<Exercise>();
  displayedColumns: string[] = [
    'date',
    'name',
    'duration',
    'calories',
    'state',
  ];

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.finishedExercisesSub = this.trainingService.completedOrCancelledExercisesChanged.subscribe(
      (finshedExercises) => {
        this.datasource.data = finshedExercises;
      }
    );
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  doFilter(event: Event): void {
    const searchKeyword = (event.target as HTMLInputElement).value;
    this.datasource.filter = searchKeyword.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.finishedExercisesSub) {
      this.finishedExercisesSub.unsubscribe();
    }
  }
}
