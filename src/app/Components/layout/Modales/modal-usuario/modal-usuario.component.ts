//Importar Recurso Inject
import { Component,OnInit,Inject } from '@angular/core';
//Importaciones necesarias
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
//
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})

export class ModalUsuarioComponent {

  //Variables necesarias
  formularioUsuario:FormGroup;
  ocultarPassword: boolean=true;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  listaRoles:Rol[]=[];

  //Injectar Dependencias
  constructor(
    private modalActual:MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA)public datosUsuario:Usuario,
    private fb:FormBuilder,
    private _rolService:RolService,
    private _usuarioService:UsuarioService,
    private _utilidadService:UtilidadService
  ) {
    //Declarar campos del formulario
    this.formularioUsuario = this.fb.group({
      nombreCompleto:["",Validators.required],
      correo:["",Validators.required],
      idRol:["",Validators.required],
      clave:["",Validators.required],
      esActivo:["1",Validators.required]
    });

    if(this.datosUsuario!=null){
      this.tituloAccion="Editar";
      this.botonAccion="Actualizar";
    }

    //Para Mostrar Todos los roles en los desplegables
    this._rolService.ListaRoles().subscribe({
      next:(data)=> {
        if(data.status)this.listaRoles=data.value;
      },
      error:(e) =>{}
    });

  }
  ngOnInit():void{
    if(this.datosUsuario!=null){
      this.formularioUsuario.patchValue({
          nombreCompleto:this.datosUsuario.nombreCompleto,
          correo:this.datosUsuario.correo,
          idRol:this.datosUsuario.idRol,
          clave:this.datosUsuario.clave,
          esActivo:this.datosUsuario.esActivo.toString()
      })
    }
  }

  guardarEditarUsuario(){
    const _usuario:Usuario={
      idUsuario:this.datosUsuario == null ? 0:this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion:"",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }
    
    if(this.datosUsuario == null){
      this._usuarioService.Guardar(_usuario).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadService.mostrarAlerta("El Usuario Fue Registrado.","Exito!")
            this.modalActual.close("true")
          }else{
            this._utilidadService.mostrarAlerta("No se Pudo Registrar el Usuario","Error")
          }
        },
        error:(e)=>{}
      })
    }
    else{
      this._usuarioService.Editar(_usuario).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadService.mostrarAlerta("El Usuario Fue Editado.","Exito!")
            this.modalActual.close("true")
          }else{
            this._utilidadService.mostrarAlerta("No se Pudo Editar el Usuario","Error")
          }
        },
        error:(e)=>{}
      })
    }

  }

}
