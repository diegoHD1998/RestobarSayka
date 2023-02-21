using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class Venta
    {
        public Venta()
        {
            Boleta = new HashSet<Boleta>();
        }

        public int IdVenta { get; set; }
        public DateTime Fecha { get; set; }
        public int? Propina { get; set; }
        public int SubTotal { get; set; }
        public int Total { get; set; }
        public string FolioBoleta { get; set; }
        public int TipoPagoIdTipoPago { get; set; }
        public int UsuarioIdUsuario { get; set; }
        public int PedidoIdPedido { get; set; }
        public TimeSpan? Hora { get; set; }

        public virtual Pedido PedidoIdPedidoNavigation { get; set; }
        public virtual TipoPago TipoPagoIdTipoPagoNavigation { get; set; }
        public virtual Usuario UsuarioIdUsuarioNavigation { get; set; }
        public virtual ICollection<Boleta> Boleta { get; set; }
    }
}
