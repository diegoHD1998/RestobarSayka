using System;

namespace RestobarSayka.Models
{
    public class TicketPedido
    {
        public int IdProductoPedido { get; set; }
        public int IdPedido { get; set; }
        public string Producto { get; set; }
        public string NombreReferencia { get; set; }

        public int Cantidad { get; set; }

        public string Mesa { get; set; }

        public string Usuario { get; set; }
        public string Comentario { get; set; }
    }
}

