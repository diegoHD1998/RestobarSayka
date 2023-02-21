using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class Zona
    {
        public Zona()
        {
            Mesas = new HashSet<Mesa>();
        }

        public int IdZona { get; set; }
        public string Nombre { get; set; }
        public string Estado { get; set; }
        public string Color { get; set; }

        public virtual ICollection<Mesa> Mesas { get; set; }
    }
}
