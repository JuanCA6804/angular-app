import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductInput, Producto } from '../productos/producto.model';
import { ProductosService } from '../productos/productos.service';

@Component({
  imports: [FormsModule],
  selector: 'app-panel',
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel implements OnInit {
  productos = signal<Producto[]>([]);
  categories = signal<string[]>([]);
  service = inject(ProductosService);
  editingId = signal<number | null>(null);
  error = signal<string>('');

  // Datos del formulario, enlazados con ngModel
  form: ProductInput = { title: '', price: 0, description: '', category: '', image: '' };

  ngOnInit(): void {
    this.cargarProductos();
    this.service.getCategories().subscribe((data) => this.categories.set(data));
  }

  cargarProductos(): void {
    this.service.obtenerProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
    });
  }

  save(): void {
    if (!this.form.title || !this.form.category || !this.form.image || this.form.price <= 0) {
      this.error.set('Completa título, precio, categoría e imagen con valores válidos.');
      return;
    }

    const id = this.editingId();
    if (id === null) {
      this.create();
    } else {
      this.update(id);
    }
  }

  // CREATE: agregar un producto
  private create(): void {
    this.service.crearProducto(this.form).subscribe({
      next: (product) => {
        this.productos.update((list) => [product, ...list]);
        this.cancel();
      },
    });
  }

  // UPDATE: guardar los cambios de un producto
  private update(id: number): void {
    this.service.actualizarProducto(id, this.form).subscribe({
      next: (product) => {
        this.productos.update((list) =>
          list.map((item) => (item.id === id ? { ...item, ...product } : item))
        );
        this.cancel();
      },
    });
  }

  // Llena el formulario con el producto que se va a editar
  edit(product: Product): void {
    this.editingId.set(product.id);
    this.form = { ...product };
  }

  // Limpia el formulario y sale del modo edición
  cancel(): void {
    this.editingId.set(null);
    this.error.set('');
    this.form = { title: '', price: 0, description: '', category: '', image: '' };
  }
}
