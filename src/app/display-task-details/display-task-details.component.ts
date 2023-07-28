import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../task.model';

@Component({
  selector: 'app-display-task-details',
  templateUrl: './display-task-details.component.html',
  styleUrls: ['./display-task-details.component.css']
})
export class DisplayTaskDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public task: Task,
    private dialogRef: MatDialogRef<DisplayTaskDetailsComponent>
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
