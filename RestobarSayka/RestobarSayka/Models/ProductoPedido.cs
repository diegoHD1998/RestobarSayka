using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class ProductoPedido
    {

        public int IdProductoPedido { get; set; }
        public int Cantidad { get; set; }
        public int Precio { get; set; }
        public string NombreReferencia { get; set; }
        public int? ModificadorPrecio { get; set; }
        public int Total { get; set; }
        public DateTime? Fecha { get; set; }
        public TimeSpan? Hora { get; set; }
        public int ProductoIdProducto { get; set; }
        public int PedidoIdPedido { get; set; }
        public bool Recepcion { get; set; }
        public string Comentario { get; set; }

        public virtual Pedido PedidoIdPedidoNavigation { get; set; }
        public virtual Producto ProductoIdProductoNavigation { get; set; }
    }
}
