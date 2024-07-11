import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion:SmallCountry[]=[];
  public borders:string[]=[];

  public myForm:FormGroup = this.fb.group({
    region : [ '', Validators.required ],
    country: [ '', Validators.required ],
    border: [ '', Validators.required ],
  })

  constructor(
    private fb:FormBuilder,
    private countrisService: CountriesService
  ){}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions():Region[]{
    return this.countrisService.regions;
  }

  onRegionChanged():void{
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('country')!.setValue('')),
        switchMap(region=> this.countrisService.getCountriesByRegion(region))
      )
      .subscribe( countries => {
        this.countriesByRegion = countries;
      });
  }

  onCountryChanged():void{
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('border')!.setValue('')),
        filter( (value:string) => value.length > 0),
        switchMap(alphaCode=> this.countrisService.getCountryByAlphaCode(alphaCode))
      )
      .subscribe( country => {
        // this.countriesByRegion = countries;
        // console.log({ borders: country.borders });
        this.borders = country.borders;

      });
  }

}
