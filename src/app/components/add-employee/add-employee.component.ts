import { CsvData, MatrixClass } from './../../shared/shared';
import { ApiService } from './../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface EmployeeToUpdate {
  name: string;
  potential: number;
  performance: number;
  department: string;
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  currentUrl: string = '';
  validateForm!: FormGroup;
  ifUpdateCurrentUserIs!: EmployeeToUpdate;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    if (this.currentUrl.startsWith('/patch')) {
      console.log('inside update ....');
      const _id = this.currentUrl.replace('/patch/', '');
      this.api.getOne(_id).subscribe({
        next: (res: any) => {
          console.log(res);
          this.ifUpdateCurrentUserIs = {
            name: res.name,
            department: res.department,
            potential: res.potential,
            performance: res.performance,
          };
          this.validateForm.controls['name'].setValue(this.ifUpdateCurrentUserIs?.name);
          this.validateForm.controls['department'].setValue(this.ifUpdateCurrentUserIs?.department);
          this.validateForm.controls['potential'].setValue(this.ifUpdateCurrentUserIs?.potential);
          this.validateForm.controls['performance'].setValue(this.ifUpdateCurrentUserIs?.performance);

          console.log(this.ifUpdateCurrentUserIs);
        },
      });
    }

    console.log(this.currentUrl);
    this.validateForm = this.formBuilder.group({
      department: [null, [Validators.required]],
      name: [null, [Validators.required]],
      potential: [null, [Validators.required]],
      performance: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    console.log('submit', this.validateForm.value);
    var form = document.getElementsByClassName(
      'needs-validation'
    )[0] as HTMLFormElement;
    form.classList.add('was-validated');
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value.name);
      const employeeData: any = { ...this.validateForm.value, class: '' };
      const dataWithClass = this.findClassAndReturnData(employeeData);
      console.log(dataWithClass);
      if (this.currentUrl.startsWith('/add')) {
        this.api.post(dataWithClass).subscribe({
          next: (res) => {
            this.router.navigateByUrl('/');
            console.log(res);
          },
        });
      }
      if (this.currentUrl.startsWith('/patch')) {
        const _id = this.currentUrl.replace('/patch/', '');
        console.log(_id);
        this.api.patch(dataWithClass, _id).subscribe({
          next: (res) => {
            this.router.navigateByUrl('/');
            console.log(res);
          },
        });
      }
    }
  }
  onCancel() {
    this.router.navigateByUrl('/');
  }

  findClassAndReturnData(data: any) {
    switch (true) {
      case data.potential == 1 && data.performance == 1: {
        data.class = MatrixClass.UNDER_PERFORMER;
        break;
      }
      case data.potential == 1 && data.performance == 2: {
        data.class = MatrixClass.EFFECTIVE;
        break;
      }
      case data.potential == 1 && data.performance == 3: {
        data.class = MatrixClass.TRUSTED_PROFESSIONAL;
        break;
      }
      case data.potential == 2 && data.performance == 1: {
        data.class = MatrixClass.DILEMMA;
        break;
      }
      case data.potential == 2 && data.performance == 2: {
        data.class = MatrixClass.CORE_EMPLOYEE;
        break;
      }
      case data.potential == 2 && data.performance == 3: {
        data.class = MatrixClass.HIGH_IMPACT_PERFORMER;
        break;
      }
      case data.potential == 3 && data.performance == 1: {
        data.class = MatrixClass.ENIGMA;
        break;
      }
      case data.potential == 3 && data.performance == 2: {
        data.class = MatrixClass.GROWTH_EMPLOYEE;
        break;
      }
      case data.potential == 3 && data.performance == 3: {
        data.class = MatrixClass.FUTURE_LEADER;
        break;
      }
      default:
        break;
    }

    let newRecords = data;
    return newRecords;
  }
}
