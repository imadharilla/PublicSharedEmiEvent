import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import {MatTabsModule} from '@angular/material/tabs';


import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule } from '@angular/material/dialog'
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDividerModule} from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper'
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';

import {CardModule} from 'primeng/card';
import {ChartModule} from 'primeng/chart';
import {ProgressBarModule} from 'primeng/progressbar';
import {PickListModule} from 'primeng/picklist';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  declarations: [],
  exports : [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatStepperModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    CardModule,
    ChartModule,
    MatGridListModule,
    ProgressBarModule,
    PickListModule,
    ConfirmDialogModule,
  ]
})
export class AngularMaterialModule { }
