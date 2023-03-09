using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestobarSayka.Models.StoredProcedure
{
    public class SP_VentasDelDia
    {
        public TimeSpan Hora { get; set; }

        public int SubTotal { get; set; }

        public int Total { get; set; }

        public int Propina { get; set; }

        public int TipoPago { get; set; }
    }
}
