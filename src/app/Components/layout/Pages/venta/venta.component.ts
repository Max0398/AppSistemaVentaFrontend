import { Component,OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { Form, FormBuilder,FormGroup,Validator, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
//
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent {

  listaProductos:Producto[]=[];
  listaProductosFiltro:Producto[]=[];
  listaProductosVenta:DetalleVenta[]=[];

  bloquearBotonRegistrar:boolean=false;
  productoSeleccionado!:Producto;
  tipoPagoPorDefecto:string="Efectivo";
  totalPagar:number=0;

  formularioProductoVenta:FormGroup;
  columnasTabla:string[]=['Producto','Cantidad','Precio','Total','Accion' ];
  datosDetallVenta=new MatTableDataSource(this.listaProductosVenta);

  retornarProductosPorFiltro(busqueda:any):Producto[]{
    const valosBuscado=typeof busqueda==="string" ? busqueda.toLowerCase:busqueda.nombre.toLowerCase();
    return this.listaProductos.filter((item => item.nombre.toLocaleLowerCase().includes(valosBuscado)));
  }

  constructor(private fb:FormBuilder,
    private _productoService:ProductoService,
    private _ventaService:VentaService,
    private _utilidadService:UtilidadService) {

      //Crear Campos para el formulario
      this.formularioProductoVenta=this.fb.group({
        producto:['',Validators.required],

        cantidad:['',Validators.required]
      })

      //Obtener los productos
      this._productoService.ListaProductos().subscribe({
        next:(data)=>{
          if(data.status){
            const lista = data.value as Producto[];
            this.listaProductos=lista.filter(p=> p.esActivo && p.stock>0);
          }
        },
        error:(e)=>{}
      })

      //funcion para cuando se filtre muestre resultado con el Producto
      this.formularioProductoVenta.get('Producto')?.valueChanges.subscribe(value =>{
        this.listaProductosFiltro= this.retornarProductosPorFiltro(value)
      });
  }
  //para mostrar el producto seleccionado
  mostrarProducto(producto:Producto):string{
    return producto.nombre;
  }

  //guardar Temporalmente el producto en la venta
  productoParaVenta(event:any){
    this.productoSeleccionado=event.option.value;
  }

  //Registrar Producto para venta
  agregarProductoVenta(){
    const _cantidad:number=this.formularioProductoVenta.value.cantidad;
    const _precio:number  = parseFloat(this.formularioProductoVenta.value.precio);
    const _total:number=_cantidad*_precio;
    this.totalPagar=this.totalPagar+_total;

    this.listaProductosVenta.push({
      idProducto:this.productoSeleccionado.idProducto,
      descripcionProducto:this.productoSeleccionado.nombre,
      cantidad:_cantidad,
      precioTexto:String(_precio.toFixed(2)),
      totalTexto:String(_total.toFixed(2))
    })

    this.datosDetallVenta=new MatTableDataSource(this.listaProductosVenta);
    this.formularioProductoVenta.patchValue({
      producto:'',
      _cantidad:''
    })

  }

}
