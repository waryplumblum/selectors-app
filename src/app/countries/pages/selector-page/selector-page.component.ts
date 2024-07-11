import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{



  public myForm:FormGroup = this.fb.group({
    region : [ '', Validators.required ],
    country: [ '', Validators.required ],
    borders: [ '', Validators.required ],
  })

  constructor(
    private fb:FormBuilder,
    private countrisService: CountriesService
  ){}

  ngOnInit(): void {
    this.onRegionChanged();
  }

  get regions():Region[]{
    return this.countrisService.regions;
  }

  onRegionChanged():void{
    this.myForm.get('region')!.valueChanges
      .pipe(
        switchMap(region=> this.countrisService.getCountriesByRegion(region))
      )
      .subscribe( region => {
        console.log({ region });
      });
  }

}
