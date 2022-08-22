import { classesExtraInfo } from './../../shared/shared';
import { Component, OnInit,ViewChild  } from '@angular/core';
import {  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { CsvData, MatrixClass } from 'src/app/shared/shared';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  
  title = '9 Box Matrix App';
  public records : any[] =[];
  records$!: Observable<any> ;
  showSidebox :boolean = false;
  isVisible = false;
  isConfirmLoading = false;
  extraInfo :any[] = classesExtraInfo;
  classEmployeesMap = new Map<string, { name:string}[]>;
  classPercentageMap = new Map<string,number |undefined>;
  exportedFileName= '9boxmatrix.xlsx';
  matrixClassArray = Object.values(MatrixClass);
  sideBoxData :{ className: string ; data: { name: string }[]; } = { className: '' , data: [] }
  @ViewChild('csvReader') csvReader :any ;
  _refresher$ =new BehaviorSubject<boolean>(false);

  constructor( private api: ApiService,
    private dialogRef :MatDialog, private router :Router ){}
  ngOnInit(): void {
    this.records$ = this._refresher$.asObservable().pipe(switchMap(_=>{
      console.log('INSIDE REFRESHER.......')
      this.get();
      return this.api.get();
    }))

    this.matrixClassArray.forEach((element: string) => {

      console.log(this.getClassIndex(element))

      
    });
    
    
  }
  
  getClassIndex(c:string){
    return Object.keys(MatrixClass).indexOf(c);
  }
  uploadListener($event :any ) :void{
    this.matrixClassArray.forEach((key, index)=>{
      this.classEmployeesMap.set(key,[]);
      this.classPercentageMap.set(key,0);
    })
    let files = $event.srcElement.files;
    console.log(files[0])
    if(this.isValidCSVFile(files[0])){
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = ()=> {
        let csvData = <string>reader.result;
        let csvRecordsArray: string[] = (csvData).split(/\r\n|\n/);
        console.log(csvRecordsArray.slice(1))
        console.log(csvRecordsArray[0].split(','))
        console.log(csvRecordsArray.length);

        const headersLength = csvRecordsArray[0].split(',').length;
        console.log(headersLength); 
        const data: CsvData[] = [];
        csvRecordsArray?.slice(1,-1).forEach((item, index) => {
          const record = new CsvData();
          const recordArray = item.split(',');
          console.log(recordArray);
          record.name = recordArray[0];
          record.department = recordArray[1];
          record.potential = recordArray[2] as unknown as number;
          record.performance = recordArray[3] as unknown as number;
          //console.log(record);
          data.push(record);
        });
        const dataWithClass = this.findClassAndReturnData(data);
        dataWithClass.forEach(element=>{
          this.post(element);
          
        });
        
        console.log('records length',this.records.length);
        console.log(this.classEmployeesMap);
        console.log(this.classPercentageMap);


      };

      reader.onerror = ()=>{
        console.log('error ocurred while reading csv file! ');
      };

    }else{
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  isValidCSVFile(file : any){
    return file.name.endsWith(".csv");

  }  
 

  fileReset(){
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  hideThis(){
    this.showSidebox = false;
  }
  toggleSideBox(matrixClass : string){
    // this.showSidebox = !this.showSidebox;
    console.log('card clicked ');
    this.showSidebox =true;
    this.sideBoxData.className = matrixClass;
    this.sideBoxData.data = this.classEmployeesMap.get(matrixClass)!;

    
  }
  hideSideBox(){
    this.showSidebox =false;
  }
 
  

 
   findClassAndReturnData(records : CsvData[]) : CsvData[]{
    let newRecords : CsvData[] = [];
    records.forEach(record=> {
      
      switch(true){
        case record.potential == 1 && record.performance == 1:
          {record.class = MatrixClass.UNDER_PERFORMER;break;}
        case record.potential == 1 && record.performance == 2:
          {record.class = MatrixClass.EFFECTIVE;break;}
        case record.potential == 1 && record.performance == 3:
          {record.class = MatrixClass.TRUSTED_PROFESSIONAL; break;}
        case record.potential == 2 && record.performance == 1:
          {record.class = MatrixClass.DILEMMA;break; } 
        case record.potential == 2 && record.performance == 2:
          {record.class = MatrixClass.CORE_EMPLOYEE;break;}
        case record.potential == 2 && record.performance == 3:
          {record.class = MatrixClass.HIGH_IMPACT_PERFORMER;break; }
        case record.potential == 3 && record.performance == 1:
          {record.class = MatrixClass.ENIGMA;break;}
        case record.potential == 3 && record.performance == 2:
          {record.class = MatrixClass.GROWTH_EMPLOYEE; break;}
        case record.potential == 3 && record.performance == 3:
          { record.class = MatrixClass.FUTURE_LEADER;break; }
        default :break;  
      }
    })
    newRecords = records;
      return newRecords;
  }
  fillMatrix(_data: any[]){
    this.matrixClassArray.forEach((key, index)=>{
      this.classEmployeesMap.set(key,[]);
      this.classPercentageMap.set(key,0);
    })
    _data.forEach((record) => {
      this.classEmployeesMap.get(record.class)?.push({name :record.name})
      this.classPercentageMap.set(record.class,this.classEmployeesMap.get(record.class)?.length)
      
    })
    
    
  }
  exportexcel(): void
  {
    let table = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); 
    XLSX.writeFile(wb, this.exportedFileName);
  }
  
  post(data :CsvData){
    this.api.post(data).subscribe({
      next : (res)=> {
        this._refresher$.next(true);
        console.log(res)
      },
      error: (err)=> console.log(err)
    })
  }
  get(){
    this.api.get().subscribe({
      next : (res : any)=>{
        this.records = res;
        this.fillMatrix(res);
      },
      error :(err)=> alert(err)
    })
  }
  onPatch(_id:any){
    this.router.navigateByUrl(`/patch/${_id}`)
  }

  deleteRecord(_id:any){
    this.api.delete(_id).subscribe({
      next : res => {
        this._refresher$.next(true);
        console.log(res)
      },
      error :err => console.log(err)
    })
  }

  onAdd(){
    this.router.navigateByUrl('/add');
  }
  
}
