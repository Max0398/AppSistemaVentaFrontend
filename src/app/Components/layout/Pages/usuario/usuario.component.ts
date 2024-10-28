import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
//importaciones necesarias
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
//implementar Oninit,AfterViewInit
export class UsuarioComponent implements OnInit,AfterViewInit {
//Variables Nesarias
  columnasTabla:string[]=['NombreCompleto','Correo','RolDescripcion','Estado','Acciones'];
  dataInicio:Usuario[]=[];
  dataListaUsuarios= new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator;

//Injectar Dependencias
  constructor(
    private dialog:MatDialog,
    private _usuarioService:UsuarioService,
    private _utilidadService: UtilidadService
  ) {}

  obtenerUsuarios(){
    this._usuarioService.ListaUsuarios().subscribe({
      next:(data) => {
        if(data.status)
         this.dataListaUsuarios.data=data.value;
        else
         this._utilidadService.mostrarAlerta("No se Encontraron Datos","Oops!");
      },
      error:(e)=>{}
    })
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator=this.paginacionTabla;
  }

  apilcarFiltrosTabla(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter=filterValue.trim().toLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado => {
      if(resultado == "true")this.obtenerUsuarios()
    });
  }

  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose:true,
      data:usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado == "true")this.obtenerUsuarios()
    });
  }

  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title:"Desea Eliminar El Usuario?",
      text:usuario.nombreCompleto,
      icon:"warning",
      confirmButtonColor:"#3085d6",
      confirmButtonText:"si , Eliminar",
      showCancelButton:true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, Volver"
    }).then((resultado)=>{
      if(resultado.isConfirmed){
        this._usuarioService.Eliminar(usuario.idUsuario).subscribe({
          next:(data)=>{
            if(data.status){
              this._utilidadService.mostrarAlerta("Usuario Eliminado","Exitoso");
              this.obtenerUsuarios();
            }else{
              this._utilidadService.mostrarAlerta("El Usuario no pudo ser eliminado","Error!")
            }
          },
          error:(e)=>{}
        })
      }

    })
  }



}
