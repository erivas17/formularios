import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit {

  forma: FormGroup;

  constructor(private fb: FormBuilder,
              private validadores: ValidadoresService) {
    this.crearFormulario();
    this.cargarDataFormulario();
    this.crearListeners();
  }



  ngOnInit(): void {
  }

  get pasatiempos(){
    return this.forma.get('pasatiempos') as FormArray;
  }

  get nombreNoValido(){
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }

  get apellidoNoValido(){
    return this.forma.get('apellido').invalid && this.forma.get('apellido').touched;
  }

  get correoNoValido(){
    return this.forma.get('correo').invalid && this.forma.get('correo').touched;
  }

  get usuarioNoValido(){
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched;
  }

  get distritoNoValido(){
    return this.forma.get('direccion.distrito').invalid && this.forma.get('direccion.distrito').touched;
  }

  get ciudadNoValido(){
    return this.forma.get('direccion.ciudad').invalid && this.forma.get('direccion.ciudad').touched;
  }

  get pass1NoValido(){
    return this.forma.get('pass1').invalid && this.forma.get('pass1').touched;
  }

  get pass2NoValido(){
    const pass1 = this.forma.get('pass1').value;
    const pass2 = this.forma.get('pass2').value;
    return (pass1 === pass2) ? false : true;
  }

  crearFormulario(){
    this.forma = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      apellido: ['', [Validators.required, Validators.minLength(5), this.validadores.noHerrera]],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      usuario: ['', , this.validadores.existeUsuario ],
      pass1: ['', [Validators.required]],
      pass2: ['', [Validators.required]],
      direccion: this.fb.group({
        distrito: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
      }),
      pasatiempos: this.fb.array([])
    },
    {
      validators: this.validadores.passwordIguales('pass1', 'pass2')
    });
  }


  cargarDataFormulario(){
    //this.forma.reset({ aqui se puede usar el reset tambien
    // en ese caso no haria falta settear todos los valores, uno por uno
     this.forma.reset({
      nombre: 'Carlos',
      apellido: 'Perez',
      correo: 'juan@gmail.com',
      pass1: '123',
      pass2: '123',
      direccion: {
        distrito: 'Ontario',
        ciudad: 'Ottawa',
      }
    });

    ['Comer', 'Dormir'].forEach( valor => this.pasatiempos.push( this.fb.control(valor) ));
  }

  guardar(){
    console.log(this.forma);

    if( this.forma.invalid ){

      return Object.values( this.forma.controls ).forEach( control => {

        if ( control instanceof FormGroup ){
          Object.values( control.controls ).forEach( control => {
            control.markAsTouched();
          })
        }
        else{
          control.markAsTouched();
        }
      });
    }

    //posteo de infromacion luego de guardar en BD
    this.forma.reset({
      nombre: 'Sin nombre'
    });
  }


  crearListeners(){
    //cambio en todo el formulario
    this.forma.valueChanges.subscribe(valor => {
      console.log(valor);
    });

    //cambio del estado del formulario
    this.forma.statusChanges.subscribe(status => {
      console.log(status);
    });

    //cambio de un campo del formulario
    this.forma.get('nombre').valueChanges.subscribe( console.log )
  }


  agregarPasaTiempo(){
    this.pasatiempos.push( this.fb.control('', Validators.required) )
  }

  borrarPasaTiempo(i: number){
    this.pasatiempos.removeAt(i);
  }
}
