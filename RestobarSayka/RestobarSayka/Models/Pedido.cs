using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class Pedido
    {
        public Pedido()
        {
            ProductoPedidos = new HashSet<ProductoPedido>();
        }

        public int IdPedido { get; set; }
        public DateTime Fecha { get; set; }
        public bool Estado { get; set; }
        public int UsuarioIdUsuario { get; set; }
        public int MesaIdMesa { get; set; }

        public virtual Mesa MesaIdMesaNavigation { get; set; }
        public virtual Usuario UsuarioIdUsuarioNavigation { get; set; }
        public virtual ICollection<ProductoPedido> ProductoPedidos { get; set; }
        public virtual ICollection<Venta> Venta { get; set; }
    }
}
