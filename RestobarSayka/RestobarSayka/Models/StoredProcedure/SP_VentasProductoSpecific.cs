using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestobarSayka.Models.StoredProcedure
{
    public class SP_VentasProductoSpecific
    {
        public string Nombre { get; set; }

        public string NombreReferencia { get; set; }

        public int Cantidad { get; set; }

        public int Total { get; set; }
    }
}
