using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestobarSayka.Models.StoredProcedure
{
    public class SP_VentasEmpleados
    {
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public int SubTotales { get; set; }

        public int Totales { get; set; }

        public int Propina { get; set; }
    }
}
