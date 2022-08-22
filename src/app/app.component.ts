import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ApiService } from './services/api.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { CsvData, MatrixClass } from './shared/shared';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  

}





