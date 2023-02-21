using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class Producto
    {
        public Producto()
        {
            ProductoModificadors = new HashSet<ProductoModificador>();
            ProductoPedidos = new HashSet<ProductoPedido>();
        }

        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int? Precio { get; set; }
        public string Imagen { get; set; }
        public string Estado { get; set; }
        public int CategoriaIdCategoria { get; set; }
        public int? VarianteIdVariante { get; set; }

        public virtual Categoria CategoriaIdCategoriaNavigation { get; set; }
        public virtual Variante VarianteIdVarianteNavigation { get; set; }
        public virtual ICollection<ProductoModificador> ProductoModificadors { get; set; }
        public virtual ICollection<ProductoPedido> ProductoPedidos { get; set; }
    }
}
