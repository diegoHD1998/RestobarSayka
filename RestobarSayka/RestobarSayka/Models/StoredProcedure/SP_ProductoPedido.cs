using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestobarSayka.Models.StoredProcedure
{
    public class SP_ProductoPedido
    {
        public int IdProductoPedido { get; set; }

        public string Nombre { get; set; }

        public string NombreReferencia { get; set; }

        public int Cantidad { get; set; }

        public TimeSpan Hora { get; set; }

        public string Mesa { get; set; }

        public string Usuario { get; set; }
    }
}
