using System;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;

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
    public class TicketCancelado
    {
        public int IdProductoPedido { get; set; }
        public int IdPedido { get; set; }
        public string Producto { get; set; }
        public string NombreReferencia { get; set; }

        public int Cantidad { get; set; }

        public string Mesa { get; set; }

        public string Usuario { get; set; }
        public string Comentario { get; set; }
        public string IpImpresora { get; set; }
    }
    public class TicketCuenta
    {
        public int IdPedido { get; set; }
        
        public string Mesa { get; set; }
        public List<ProductoCuenta> productosCuenta { get; set; }
        public int Subtotal { get; set; }
        public int Propina { get; set; }
        public int Total { get; set; }
        public string Usuario { get; set; }

    }
    public class ProductoCuenta
    {
        public string nombre { get; set; }
        public int Cantidad { get; set; }
        public int Precio { get; set; }
        public string NombreReferencia { get; set; }
        public int Total { get; set; }
        public string Usuario { get; set; }

    }
}

