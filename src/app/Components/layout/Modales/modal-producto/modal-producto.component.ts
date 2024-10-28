//Importar Recurso Inject
import { Component,OnInit,Inject } from '@angular/core';
//Importaciones necesarias
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent {
 //Variables necesarias
 formularioProducto:FormGroup;
 tituloAccion:string="Agregar";
 botonAccion:string="Guardar";
 listaCategorias:Categoria[]=[];

   //Injectar Dependencias
   constructor(
    private modalActual:MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA)public datosProducto:Producto,
    private fb:FormBuilder,
    private _categoriaService:CategoriaService,
    private _productService:ProductoService,
    private _utilidadService:UtilidadService
  ) {
    //Declarar campos del formulario
    this.formularioProducto = this.fb.group({
      nombre:["",Validators.required],
      idCategoria:["",Validators.required],
      stock:["",Validators.required],
      precio:["",Validators.required],
      esActivo:["1",Validators.required]
    });

    if(this.datosProducto!=null){
      this.tituloAccion="Editar";
      this.botonAccion="Actualizar";
    }

    //Para Mostrar Todas las categorias en los desplegables
    this._categoriaService.ListaCategorias().subscribe({
      next:(data)=> {
        if(data.status)this.listaCategorias=data.value;
      },
      error:(e) =>{}
    });

  }

  ngOnInit():void{
    if(this.datosProducto!=null){
      this.formularioProducto.patchValue({
          nombre:this.datosProducto.nombre,
          idCategoria:this.datosProducto.idCategoria,
          stock:this.datosProducto.stock,
          precio:this.datosProducto.precio,
          esActivo:this.datosProducto.esActivo.toString()
      })
    }
  }

  guardarEditarProducto(){
    const _producto:Producto={
      idProducto:this.datosProducto == null ? 0:this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria:"",
      precio:this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo)
    }
    
    if(this.datosProducto == null){
      this._productService.GuardarProducto(_producto).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadService.mostrarAlerta("El Producto Fue Registrado.","Exito!")
            this.modalActual.close("true")
          }else{
            this._utilidadService.mostrarAlerta("No se Pudo Registrar el Producto","Error")
          }
        },
        error:(e)=>{}
      })
    }
    else{
      this._productService.EditarProducto(_producto).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadService.mostrarAlerta("El Producto Fue Editado.","Exito!")
            this.modalActual.close("true")
          }else{
            this._utilidadService.mostrarAlerta("No se Pudo Editar el Producto","Error")
          }
        },
        error:(e)=>{}
      })
    }

  }


}
