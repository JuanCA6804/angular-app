import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Producto } from './producto.model';
import { ProductosService } from './productos.service';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  private readonly productosService = inject(ProductosService);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.productosService.obtenerProductos().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar los productos. Intenta de nuevo más tarde.');
        this.cargando.set(false);
      },
    });
  }
}
