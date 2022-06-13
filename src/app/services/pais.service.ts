import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor( private http: HttpClient) { }

  getPaises(){
    return this.http.get('http://api.countrylayer.com/v2/all?access_key=1304f9b74e3e7981ca9805322966fb7f')
      .pipe(
        map( (resp: any[]) =>{
          return resp.map( pais => {
            return {
              nombre: pais.name,
              codigo: pais.alpha3Code
            }
          })
        })
      );
  }

}
